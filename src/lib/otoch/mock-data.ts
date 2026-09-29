import "server-only";
import { EMPRESAS } from "@/lib/otoch/empresas";
import type {
  Categoria,
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
