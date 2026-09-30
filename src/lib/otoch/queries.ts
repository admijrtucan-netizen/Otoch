import "server-only";
import { runQuery, DATASET } from "@/lib/bigquery";
import type {
  Categoria,
  EstadoDeResultados,
  MovimientoPendiente,
  Obra,
  PagoImpuesto,
  PuntoMensual,
  Proveedor,
  ResumenEmpresa,
} from "@/lib/otoch/types";

const TABLE = `bases-de-datos-sheets.${DATASET}.Otoch_CONTROL`;

/**
 * Convención verificada contra datos reales (2026-09-29): MONTO se guarda en
 * signo — positivo para INGRESO, negativo para EGRESO — y la columna TIPO
 * tiene 6 valores exactos: INGRESO, EGRESO, CC (cambio de caja), CXP
 * (cuentas por pagar), CxC (cuentas por cobrar) y PRESUPUESTO (residual, 1
 * fila). Se sigue usando LOWER()+LIKE en vez de igualdad exacta como margen
 * de seguridad ante variantes futuras de captura manual.
 */
const CASE_INGRESO = `SUM(CASE WHEN LOWER(TIPO) LIKE '%ingres%' THEN ABS(MONTO) ELSE 0 END)`;
const CASE_EGRESO = `SUM(CASE WHEN LOWER(TIPO) LIKE '%egres%' THEN ABS(MONTO) ELSE 0 END)`;

/**
 * La columna ESTADO_DE_RESULTADOS ya trae la estructura del estado de
 * resultados capturada a mano, con prefijo a-h para el orden contable:
 * a.VENTAS · b.COSTO DE VENTA · c.GASTOS DE ADMINISTRACION ·
 * d.GASTOS DE VENTAS · e.GASTOS FINANCIEROS · f.IMPUESTOS ·
 * g.OTROS GASTOS · h.OTROS INGRESOS. "ANTERIOR" (saldo de periodos
 * anteriores) y valores nulos quedan fuera a propósito — no son parte del
 * estado de resultados del periodo.
 */
// BigQuery devuelve las columnas DATE como { value: "AAAA-MM-DD" }, no como string.
interface MovimientoPendienteCrudo {
  contraparte: string;
  concepto: string;
  monto: number;
  fecha: { value: string } | string;
}

function limpiarMovimiento(m: MovimientoPendienteCrudo): MovimientoPendiente {
  return {
    contraparte: m.contraparte,
    concepto: m.concepto,
    monto: m.monto,
    fecha: typeof m.fecha === "object" ? m.fecha.value : m.fecha,
  };
}

/**
 * OJO — bug real encontrado y corregido (2026-09-29): dentro de una misma
 * categoría de ESTADO_DE_RESULTADOS puede haber montos con signo mixto
 * (ajustes/créditos que reducen el costo, no solo cargos). Usar ABS(MONTO)
 * suma las magnitudes en vez de dejarlas cancelarse y llegó a inflar
 * "Costo de venta" más de 2x. La suma debe hacerse CON signo y negarse al
 * final para las categorías de gasto — nunca ABS() sobre una categoría
 * contable de texto libre, solo sobre columnas cuyo signo ya se verificó
 * 100% consistente (como TIPO, ver CASE_INGRESO/CASE_EGRESO arriba).
 */
function pylSelect(): string {
  return `
    SUM(CASE WHEN ESTADO_DE_RESULTADOS = 'a.VENTAS' THEN MONTO ELSE 0 END) AS ventas,
    -SUM(CASE WHEN ESTADO_DE_RESULTADOS = 'b.COSTO DE VENTA' THEN MONTO ELSE 0 END) AS costoVenta,
    -SUM(CASE WHEN ESTADO_DE_RESULTADOS = 'c.GASTOS DE ADMINISTRACION' THEN MONTO ELSE 0 END) AS gastosAdmin,
    -SUM(CASE WHEN ESTADO_DE_RESULTADOS = 'd.GASTOS DE VENTAS' THEN MONTO ELSE 0 END) AS gastosVenta,
    -SUM(CASE WHEN ESTADO_DE_RESULTADOS = 'e.GASTOS FINANCIEROS' THEN MONTO ELSE 0 END) AS gastosFinancieros,
    -SUM(CASE WHEN ESTADO_DE_RESULTADOS = 'f.IMPUESTOS' THEN MONTO ELSE 0 END) AS impuestos,
    -SUM(CASE WHEN ESTADO_DE_RESULTADOS = 'g.OTROS GASTOS' THEN MONTO ELSE 0 END) AS otrosGastos,
    SUM(CASE WHEN ESTADO_DE_RESULTADOS = 'h.OTROS INGRESOS' THEN MONTO ELSE 0 END) AS otrosIngresos
  `;
}

export async function getResumenPorEmpresa(): Promise<ResumenEmpresa[]> {
  const rows = await runQuery<{
    empresa: string;
    ingresos: number;
    egresos: number;
  }>(`
    SELECT
      EMPRESAS AS empresa,
      ${CASE_INGRESO} AS ingresos,
      ${CASE_EGRESO} AS egresos
    FROM \`${TABLE}\`
    WHERE EMPRESAS IS NOT NULL
    GROUP BY empresa
  `);

  return rows.map((r) => ({
    empresa: r.empresa,
    ingresos: r.ingresos ?? 0,
    egresos: r.egresos ?? 0,
    neto: (r.ingresos ?? 0) - (r.egresos ?? 0),
  }));
}

export async function getSerieMensual(
  nombreEnBase: string
): Promise<PuntoMensual[]> {
  // Se agrupa por la FECHA real, no por las columnas de texto libre "mes"/
  // "A__o" — esas se capturan a mano y una sola vez que alguien escriba
  // "Diciembre" en vez de "diciembre" ya cuenta como un mes aparte (mismo
  // problema documentado en Brain OS con "Estrategia" escrita de 9 formas).
  const rows = await runQuery<{
    anio: number;
    ordenMes: number;
    ingresos: number;
    egresos: number;
  }>(
    `
    SELECT
      EXTRACT(YEAR FROM FECHA_DE_REGISTRO) AS anio,
      EXTRACT(MONTH FROM FECHA_DE_REGISTRO) AS ordenMes,
      ${CASE_INGRESO} AS ingresos,
      ${CASE_EGRESO} AS egresos
    FROM \`${TABLE}\`
    WHERE EMPRESAS = @empresa AND FECHA_DE_REGISTRO IS NOT NULL
    GROUP BY anio, ordenMes
  `,
    { empresa: nombreEnBase }
  );

  return rows
    .map((r) => ({
      anio: r.anio,
      ordenMes: r.ordenMes,
      ingresos: r.ingresos ?? 0,
      egresos: r.egresos ?? 0,
    }))
    .sort((a, b) => a.anio - b.anio || a.ordenMes - b.ordenMes);
}

/**
 * Solo EGRESO a propósito: CATEGORIA_1 mezcla categorías de ingreso (p.ej.
 * "AIRBNB", "FONDO DE RESERVA") con categorías de gasto (p.ej.
 * "MANTENIMIENTOS") — sin filtrar, "por categoría" mezclaba ventas y
 * costos en un solo ranking. TIPO='EGRESO' está verificado 100% negativo
 * (ver nota de CASE_INGRESO/CASE_EGRESO), así que ABS() aquí sí es seguro.
 */
export async function getCategorias(
  nombreEnBase: string,
  limite = 8
): Promise<Categoria[]> {
  return runQuery<Categoria>(
    `
    SELECT CATEGORIA_1 AS categoria, SUM(ABS(MONTO)) AS total
    FROM \`${TABLE}\`
    WHERE EMPRESAS = @empresa
      AND CATEGORIA_1 IS NOT NULL
      AND LOWER(TIPO) LIKE '%egres%'
    GROUP BY categoria
    ORDER BY total DESC
    LIMIT @limite
  `,
    { empresa: nombreEnBase, limite }
  );
}

export async function getTopProveedores(
  nombreEnBase: string,
  limite = 8
): Promise<Proveedor[]> {
  return runQuery<Proveedor>(
    `
    SELECT PROVEEDORES AS proveedor, SUM(ABS(MONTO)) AS total
    FROM \`${TABLE}\`
    WHERE EMPRESAS = @empresa
      AND PROVEEDORES IS NOT NULL
      AND LOWER(TIPO) LIKE '%egres%'
    GROUP BY proveedor
    ORDER BY total DESC
    LIMIT @limite
  `,
    { empresa: nombreEnBase, limite }
  );
}

/** Estado de resultados de toda la empresa, o de una sola línea de negocio si se pasa `nombreEnBase`. */
export async function getEstadoDeResultados(
  nombreEnBase?: string
): Promise<EstadoDeResultados> {
  const where = nombreEnBase ? "WHERE EMPRESAS = @empresa" : "";
  const rows = await runQuery<EstadoDeResultados>(
    `
    SELECT ${pylSelect()}
    FROM \`${TABLE}\`
    ${where}
  `,
    nombreEnBase ? { empresa: nombreEnBase } : undefined
  );
  return (
    rows[0] ?? {
      ventas: 0,
      costoVenta: 0,
      gastosAdmin: 0,
      gastosVenta: 0,
      gastosFinancieros: 0,
      impuestos: 0,
      otrosIngresos: 0,
      otrosGastos: 0,
    }
  );
}

/**
 * Costos/gastos e ingresos por OBRA_TRABAJO__ingreso (la columna real de
 * "obra"/proyecto/propiedad del Sheet) dentro de una línea de negocio.
 * "ANTERIOR" y "PENDIENTE" se excluyen — son marcadores administrativos,
 * no obras reales.
 */
export async function getPorObra(
  nombreEnBase: string,
  limite = 12
): Promise<Obra[]> {
  const rows = await runQuery<{ obra: string; ingresos: number; egresos: number }>(
    `
    SELECT
      OBRA_TRABAJO__ingreso AS obra,
      ${CASE_INGRESO} AS ingresos,
      ${CASE_EGRESO} AS egresos
    FROM \`${TABLE}\`
    WHERE EMPRESAS = @empresa
      AND OBRA_TRABAJO__ingreso IS NOT NULL
      AND OBRA_TRABAJO__ingreso NOT IN ('ANTERIOR', 'PENDIENTE')
    GROUP BY obra
    ORDER BY (ingresos + egresos) DESC
    LIMIT @limite
  `,
    { empresa: nombreEnBase, limite }
  );

  return rows.map((r) => ({
    obra: r.obra,
    ingresos: r.ingresos ?? 0,
    egresos: r.egresos ?? 0,
    neto: (r.ingresos ?? 0) - (r.egresos ?? 0),
  }));
}

/** Dinero que OTOCH le debe a terceros — TIPO = 'CXP' (cuentas por pagar). */
export async function getCuentasPorPagar(): Promise<{
  total: number;
  movimientos: MovimientoPendiente[];
}> {
  const movimientos = await runQuery<MovimientoPendienteCrudo>(
    `
    SELECT
      PROVEEDORES AS contraparte,
      CONCEPTOS AS concepto,
      ABS(MONTO) AS monto,
      FECHA_DE_REGISTRO AS fecha
    FROM \`${TABLE}\`
    WHERE TIPO = 'CXP'
    ORDER BY fecha DESC
  `
  );
  const limpios = movimientos.map(limpiarMovimiento);
  return {
    total: limpios.reduce((acc, m) => acc + m.monto, 0),
    movimientos: limpios,
  };
}

/** Dinero que le deben a OTOCH — TIPO = 'CxC' (cuentas por cobrar, p.ej. fondos de reserva). */
export async function getCuentasPorCobrar(): Promise<{
  total: number;
  movimientos: MovimientoPendiente[];
}> {
  const movimientos = await runQuery<MovimientoPendienteCrudo>(
    `
    SELECT
      PROVEEDORES AS contraparte,
      CONCEPTOS AS concepto,
      ABS(MONTO) AS monto,
      FECHA_DE_REGISTRO AS fecha
    FROM \`${TABLE}\`
    WHERE TIPO = 'CxC'
    ORDER BY fecha DESC
  `
  );
  const limpios = movimientos.map(limpiarMovimiento);
  return {
    total: limpios.reduce((acc, m) => acc + m.monto, 0),
    movimientos: limpios,
  };
}

/**
 * "Dinero OTOCH" — el monto general de la operación, a pedido explícito de
 * Andrea: SOLO contempla TIPO IN ('INGRESO','EGRESO','CC'), sumado CON
 * signo para que ingresos, egresos y cambios de caja se cancelen entre sí
 * como es correcto (CC en particular trae movimientos de ambos signos —
 * ver la nota de CASE_INGRESO/CASE_EGRESO). CXP y CxC quedan fuera a
 * propósito — esos ya tienen sus propias tarjetas.
 */
export async function getMontoTotalOtoch(): Promise<number> {
  const rows = await runQuery<{ total: number }>(`
    SELECT SUM(MONTO) AS total
    FROM \`${TABLE}\`
    WHERE TIPO IN ('INGRESO', 'EGRESO', 'CC')
  `);
  return rows[0]?.total ?? 0;
}

/** Cada pago de impuestos (SAT), con su fecha — para el acercamiento desde la tarjeta de Impuestos. */
export async function getImpuestosDetalle(): Promise<PagoImpuesto[]> {
  const rows = await runQuery<{
    fecha: { value: string } | string;
    empresa: string;
    concepto: string;
    monto: number;
  }>(`
    SELECT
      FECHA_DE_REGISTRO AS fecha,
      EMPRESAS AS empresa,
      CONCEPTOS AS concepto,
      ABS(MONTO) AS monto
    FROM \`${TABLE}\`
    WHERE ESTADO_DE_RESULTADOS = 'f.IMPUESTOS'
    ORDER BY fecha DESC
  `);
  return rows.map((r) => ({
    fecha: typeof r.fecha === "object" ? r.fecha.value : r.fecha,
    empresa: r.empresa,
    concepto: r.concepto,
    monto: r.monto,
  }));
}
