export interface ResumenEmpresa {
  empresa: string;
  ingresos: number;
  egresos: number;
  neto: number;
}

export interface PuntoMensual {
  anio: number;
  mes: string;
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
