export interface ResumenEmpresa {
  empresa: string;
  ingresos: number;
  egresos: number;
  neto: number;
}

export interface PuntoMensual {
  anio: number;
  /** 1 = enero ... 12 = diciembre, derivado de la fecha real (no de texto libre). */
  ordenMes: number;
  ingresos: number;
  egresos: number;
}

export interface Categoria {
  categoria: string;
  total: number;
}

export interface Proveedor {
  proveedor: string;
  total: number;
}

export interface Obra {
  obra: string;
  ingresos: number;
  egresos: number;
  neto: number;
}

/**
 * Estado de resultados (P&L) — espejo exacto de la columna ESTADO_DE_RESULTADOS
 * del Sheet (a.VENTAS ... h.OTROS INGRESOS). Los totales derivados
 * (utilidadBruta, utilidadOperativa, utilidadNeta) se calculan con
 * `calcularUtilidades`, nunca se guardan por separado, para que la fórmula
 * viva en un solo lugar.
 */
export interface EstadoDeResultados {
  ventas: number;
  costoVenta: number;
  gastosAdmin: number;
  gastosVenta: number;
  gastosFinancieros: number;
  impuestos: number;
  otrosIngresos: number;
  otrosGastos: number;
}

export interface Utilidades extends EstadoDeResultados {
  utilidadBruta: number;
  utilidadOperativa: number;
  utilidadAntesDeImpuestos: number;
  utilidadNeta: number;
}

export function calcularUtilidades(pyl: EstadoDeResultados): Utilidades {
  const utilidadBruta = pyl.ventas - pyl.costoVenta;
  const utilidadOperativa = utilidadBruta - pyl.gastosAdmin - pyl.gastosVenta;
  const utilidadAntesDeImpuestos =
    utilidadOperativa - pyl.gastosFinancieros + pyl.otrosIngresos - pyl.otrosGastos;
  const utilidadNeta = utilidadAntesDeImpuestos - pyl.impuestos;
  return { ...pyl, utilidadBruta, utilidadOperativa, utilidadAntesDeImpuestos, utilidadNeta };
}

export interface MovimientoPendiente {
  contraparte: string;
  concepto: string;
  monto: number;
  fecha: string;
}

export const ORDEN_MESES: Record<string, number> = {
  enero: 1,
  febrero: 2,
  marzo: 3,
  abril: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto: 8,
  septiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre: 12,
};

export function ordenDeMes(mes: string | null | undefined): number {
  if (!mes) return 0;
  return ORDEN_MESES[mes.trim().toLowerCase()] ?? 0;
}

export interface PagoImpuesto {
  fecha: string;
  empresa: string;
  concepto: string;
  monto: number;
}
