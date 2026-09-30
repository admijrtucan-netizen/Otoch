import "server-only";
import { EMPRESAS } from "@/lib/otoch/empresas";
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

/**
 * Datos de ejemplo — misma forma exacta que las consultas reales de
 * src/lib/otoch/queries.ts, para poder construir y ver las pantallas antes
 * de tener la cuenta de servicio de BigQuery lista. Números inventados,
 * NO son cifras reales de OTOCH.
 */

const MOCK_RESUMEN: Record<string, ResumenEmpresa> = {
  "OTOCH COLIBRI": { empresa: "OTOCH COLIBRI", ingresos: 612400, egresos: 398200, neto: 214200 },
  "OTOCH INTERIORISMO": { empresa: "OTOCH INTERIORISMO", ingresos: 845000, egresos: 701500, neto: 143500 },
  "OTOCH ADM PROPIEDADES": { empresa: "OTOCH ADM PROPIEDADES", ingresos: 356000, egresos: 289000, neto: 67000 },
};

export function getResumenPorEmpresaMock(): ResumenEmpresa[] {
  return EMPRESAS.map((e) => MOCK_RESUMEN[e.nombreEnBase]);
}

const MESES_DEMO = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
];

export function getSerieMensualMock(nombreEnBase: string): PuntoMensual[] {
  const base = MOCK_RESUMEN[nombreEnBase] ?? MOCK_RESUMEN["OTOCH COLIBRI"];
  const promedioIngreso = base.ingresos / MESES_DEMO.length;
  const promedioEgreso = base.egresos / MESES_DEMO.length;

  // Variación determinista (sin Math.random) para que el mock sea estable
  // entre renders y entre servidor/cliente.
  return MESES_DEMO.map((_, i) => {
    const factor = 0.75 + ((i * 37) % 50) / 100; // entre 0.75 y 1.24
    return {
      anio: 2026,
      ordenMes: i + 1,
      ingresos: Math.round(promedioIngreso * factor),
      egresos: Math.round(promedioEgreso * (1.5 - factor)),
    };
  });
}

const CATEGORIAS_POR_EMPRESA: Record<string, Categoria[]> = {
  "OTOCH COLIBRI": [
    { categoria: "Personal Shopper", total: 210000 },
    { categoria: "Implementación", total: 165000 },
    { categoria: "Comisiones", total: 58000 },
    { categoria: "Gastos operativos", total: 41000 },
  ],
  "OTOCH INTERIORISMO": [
    { categoria: "Mobiliario", total: 320000 },
    { categoria: "Decoración", total: 145000 },
    { categoria: "Instalación", total: 98000 },
    { categoria: "Electrodomésticos", total: 87000 },
    { categoria: "Blancos", total: 51500 },
  ],
  "OTOCH ADM PROPIEDADES": [
    { categoria: "Mantenimiento", total: 118000 },
    { categoria: "Servicios", total: 84000 },
    { categoria: "Nómina", total: 62000 },
    { categoria: "Seguros", total: 25000 },
  ],
};

export function getCategoriasMock(nombreEnBase: string): Categoria[] {
  return CATEGORIAS_POR_EMPRESA[nombreEnBase] ?? [];
}

const PROVEEDORES_POR_EMPRESA: Record<string, Proveedor[]> = {
  "OTOCH COLIBRI": [
    { proveedor: "Liverpool", total: 92000 },
    { proveedor: "Amazon MX", total: 54000 },
    { proveedor: "Home Depot", total: 31000 },
  ],
  "OTOCH INTERIORISMO": [
    { proveedor: "Elektra", total: 138000 },
    { proveedor: "Sherwin Williams", total: 76000 },
    { proveedor: "Muebles Dico", total: 65000 },
    { proveedor: "Persianas del Sureste", total: 42000 },
  ],
  "OTOCH ADM PROPIEDADES": [
    { proveedor: "CFE", total: 38000 },
    { proveedor: "Mantenimiento Integral Mérida", total: 33000 },
    { proveedor: "Seguros Atlas", total: 21000 },
  ],
};

export function getTopProveedoresMock(nombreEnBase: string): Proveedor[] {
  return PROVEEDORES_POR_EMPRESA[nombreEnBase] ?? [];
}

const PYL_POR_EMPRESA: Record<string, EstadoDeResultados> = {
  "OTOCH COLIBRI": {
    ventas: 590000,
    costoVenta: 250000,
    gastosAdmin: 180000,
    gastosVenta: 70000,
    gastosFinancieros: 12000,
    impuestos: 35000,
    otrosIngresos: 22400,
    otrosGastos: 0,
  },
  "OTOCH INTERIORISMO": {
    ventas: 810000,
    costoVenta: 470000,
    gastosAdmin: 150000,
    gastosVenta: 60000,
    gastosFinancieros: 8000,
    impuestos: 20000,
    otrosIngresos: 35000,
    otrosGastos: 5000,
  },
  "OTOCH ADM PROPIEDADES": {
    ventas: 340000,
    costoVenta: 150000,
    gastosAdmin: 90000,
    gastosVenta: 20000,
    gastosFinancieros: 4000,
    impuestos: 12000,
    otrosIngresos: 16000,
    otrosGastos: 0,
  },
};

export function getEstadoDeResultadosMock(nombreEnBase?: string): EstadoDeResultados {
  if (nombreEnBase) {
    return (
      PYL_POR_EMPRESA[nombreEnBase] ?? {
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
  return Object.values(PYL_POR_EMPRESA).reduce(
    (acc, p) => ({
      ventas: acc.ventas + p.ventas,
      costoVenta: acc.costoVenta + p.costoVenta,
      gastosAdmin: acc.gastosAdmin + p.gastosAdmin,
      gastosVenta: acc.gastosVenta + p.gastosVenta,
      gastosFinancieros: acc.gastosFinancieros + p.gastosFinancieros,
      impuestos: acc.impuestos + p.impuestos,
      otrosIngresos: acc.otrosIngresos + p.otrosIngresos,
      otrosGastos: acc.otrosGastos + p.otrosGastos,
    }),
    {
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

const OBRAS_POR_EMPRESA: Record<string, Obra[]> = {
  "OTOCH COLIBRI": [
    { obra: "DAS HAUS", ingresos: 42000, egresos: 21000, neto: 21000 },
    { obra: "KUXTAL", ingresos: 38000, egresos: 19500, neto: 18500 },
    { obra: "MAKECH", ingresos: 31000, egresos: 28000, neto: 3000 },
  ],
  "OTOCH INTERIORISMO": [
    { obra: "Diseño de Interiores Carlos Lima", ingresos: 132000, egresos: 98000, neto: 34000 },
    { obra: "OFICINA", ingresos: 0, egresos: 45000, neto: -45000 },
  ],
  "OTOCH ADM PROPIEDADES": [
    { obra: "TURIX", ingresos: 28000, egresos: 9000, neto: 19000 },
    { obra: "MAXCANU", ingresos: 22000, egresos: 7500, neto: 14500 },
    { obra: "YAXLUM", ingresos: 15000, egresos: 6000, neto: 9000 },
  ],
};

export function getPorObraMock(nombreEnBase: string): Obra[] {
  return OBRAS_POR_EMPRESA[nombreEnBase] ?? [];
}

export function getCuentasPorPagarMock(): { total: number; movimientos: MovimientoPendiente[] } {
  const movimientos: MovimientoPendiente[] = [
    {
      contraparte: "Adriana (servicio de hospedaje y gestión)",
      concepto: "Mensualidad",
      monto: 6424,
      fecha: "2026-09-10",
    },
    {
      contraparte: "Jesús Armando Salazar",
      concepto: "Comisión mercantil",
      monto: 19150,
      fecha: "2026-09-30",
    },
  ];
  return { total: movimientos.reduce((a, m) => a + m.monto, 0), movimientos };
}

export function getCuentasPorCobrarMock(): { total: number; movimientos: MovimientoPendiente[] } {
  const movimientos: MovimientoPendiente[] = [
    {
      contraparte: "María Guadalupe Rosas González",
      concepto: "Fondo de reserva",
      monto: 5758,
      fecha: "2026-09-10",
    },
    {
      contraparte: "Alejandro Dogre",
      concepto: "Fondo de reserva",
      monto: 7677,
      fecha: "2026-09-10",
    },
  ];
  return { total: movimientos.reduce((a, m) => a + m.monto, 0), movimientos };
}

export function getMontoTotalOtochMock(): number {
  const resumen = getResumenPorEmpresaMock();
  const netoIngresosEgresos = resumen.reduce((a, r) => a + r.neto, 0);
  return netoIngresosEgresos + 12000; // + un cambio de caja de ejemplo
}

export function getImpuestosDetalleMock(): PagoImpuesto[] {
  return [
    { fecha: "2026-09-22", empresa: "OTOCH COLIBRI", concepto: "Línea de captura SAT", monto: 5447 },
    { fecha: "2026-09-22", empresa: "OTOCH COLIBRI", concepto: "Línea de captura SAT", monto: 982 },
    { fecha: "2026-09-11", empresa: "OTOCH COLIBRI", concepto: "Línea de captura SAT", monto: 10652 },
    { fecha: "2026-09-11", empresa: "OTOCH COLIBRI", concepto: "Línea de captura SAT", monto: 5672 },
    { fecha: "2026-07-06", empresa: "OTOCH COLIBRI", concepto: "Línea de captura SAT", monto: 26471 },
  ];
}
