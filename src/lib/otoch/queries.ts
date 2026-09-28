import "server-only";
import { runQuery, DATASET } from "@/lib/bigquery";
import { ordenDeMes } from "@/lib/otoch/types";
import type {
  Categoria,
  PuntoMensual,
  Proveedor,
  ResumenEmpresa,
} from "@/lib/otoch/types";

const TABLE = `bases-de-datos-sheets.${DATASET}.Otoch_CONTROL`;

/**
 * Convención asumida (pendiente de verificar contra datos reales): MONTO se
 * guarda en magnitud positiva y TIPO distingue ingreso/egreso por texto
 * libre ("Ingreso", "INGRESO", "ingreso ", etc. — de ahí el LOWER()+LIKE en
 * vez de una igualdad exacta). Si la convención real es otra, ajustar aquí,
 * no en cada página.
 */
const CASE_INGRESO = `SUM(CASE WHEN LOWER(TIPO) LIKE '%ingres%' THEN ABS(MONTO) ELSE 0 END)`;
const CASE_EGRESO = `SUM(CASE WHEN LOWER(TIPO) LIKE '%egres%' THEN ABS(MONTO) ELSE 0 END)`;

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
  const rows = await runQuery<{
    anio: number;
    mes: string;
    ingresos: number;
    egresos: number;
  }>(
    `
    SELECT
      A__o AS anio,
      mes AS mes,
      ${CASE_INGRESO} AS ingresos,
      ${CASE_EGRESO} AS egresos
    FROM \`${TABLE}\`
    WHERE EMPRESAS = @empresa
    GROUP BY anio, mes
  `,
    { empresa: nombreEnBase }
  );

  return rows
    .map((r) => ({
      anio: r.anio,
      mes: r.mes,
      ordenMes: ordenDeMes(r.mes),
      ingresos: r.ingresos ?? 0,
      egresos: r.egresos ?? 0,
    }))
    .sort((a, b) => a.anio - b.anio || a.ordenMes - b.ordenMes);
}

export async function getCategorias(
  nombreEnBase: string,
  limite = 8
): Promise<Categoria[]> {
  return runQuery<Categoria>(
    `
    SELECT CATEGORIA_1 AS categoria, SUM(ABS(MONTO)) AS total
    FROM \`${TABLE}\`
    WHERE EMPRESAS = @empresa AND CATEGORIA_1 IS NOT NULL
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
