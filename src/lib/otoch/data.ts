import "server-only";
import * as real from "@/lib/otoch/queries";
import * as mock from "@/lib/otoch/mock-data";
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

export function isBigQueryConfigured(): boolean {
  return Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
}

/**
 * Cada función intenta la consulta real y, si BigQuery no está configurado
 * todavía (o la consulta falla), cae a datos de ejemplo — pero siempre
 * avisando con `esDemo` para que la UI muestre el aviso correspondiente.
 * Nunca se muestra un dato de ejemplo como si fuera real en silencio.
 */

export async function resumenPorEmpresa(): Promise<{
  datos: ResumenEmpresa[];
  esDemo: boolean;
}> {
  if (!isBigQueryConfigured()) {
    return { datos: mock.getResumenPorEmpresaMock(), esDemo: true };
  }
  try {
    return { datos: await real.getResumenPorEmpresa(), esDemo: false };
  } catch (error) {
    console.error("Falló la consulta real de resumen por empresa:", error);
    return { datos: mock.getResumenPorEmpresaMock(), esDemo: true };
  }
}

export async function serieMensual(
  nombreEnBase: string
): Promise<{ datos: PuntoMensual[]; esDemo: boolean }> {
  if (!isBigQueryConfigured()) {
    return { datos: mock.getSerieMensualMock(nombreEnBase), esDemo: true };
  }
  try {
    return { datos: await real.getSerieMensual(nombreEnBase), esDemo: false };
  } catch (error) {
    console.error("Falló la consulta real de serie mensual:", error);
    return { datos: mock.getSerieMensualMock(nombreEnBase), esDemo: true };
  }
}

export async function categorias(
  nombreEnBase: string
): Promise<{ datos: Categoria[]; esDemo: boolean }> {
  if (!isBigQueryConfigured()) {
    return { datos: mock.getCategoriasMock(nombreEnBase), esDemo: true };
  }
  try {
    return { datos: await real.getCategorias(nombreEnBase), esDemo: false };
  } catch (error) {
    console.error("Falló la consulta real de categorías:", error);
    return { datos: mock.getCategoriasMock(nombreEnBase), esDemo: true };
  }
}

export async function topProveedores(
  nombreEnBase: string
): Promise<{ datos: Proveedor[]; esDemo: boolean }> {
  if (!isBigQueryConfigured()) {
    return { datos: mock.getTopProveedoresMock(nombreEnBase), esDemo: true };
  }
  try {
    return { datos: await real.getTopProveedores(nombreEnBase), esDemo: false };
  } catch (error) {
    console.error("Falló la consulta real de proveedores:", error);
    return { datos: mock.getTopProveedoresMock(nombreEnBase), esDemo: true };
  }
}

export async function estadoDeResultados(
  nombreEnBase?: string
): Promise<{ datos: EstadoDeResultados; esDemo: boolean }> {
  if (!isBigQueryConfigured()) {
    return { datos: mock.getEstadoDeResultadosMock(nombreEnBase), esDemo: true };
  }
  try {
    return { datos: await real.getEstadoDeResultados(nombreEnBase), esDemo: false };
  } catch (error) {
    console.error("Falló la consulta real de estado de resultados:", error);
    return { datos: mock.getEstadoDeResultadosMock(nombreEnBase), esDemo: true };
  }
}

export async function porObra(
  nombreEnBase: string
): Promise<{ datos: Obra[]; esDemo: boolean }> {
  if (!isBigQueryConfigured()) {
    return { datos: mock.getPorObraMock(nombreEnBase), esDemo: true };
  }
  try {
    return { datos: await real.getPorObra(nombreEnBase), esDemo: false };
  } catch (error) {
    console.error("Falló la consulta real de obras:", error);
    return { datos: mock.getPorObraMock(nombreEnBase), esDemo: true };
  }
}

export async function cuentasPorPagar(): Promise<{
  datos: { total: number; movimientos: MovimientoPendiente[] };
  esDemo: boolean;
}> {
  if (!isBigQueryConfigured()) {
    return { datos: mock.getCuentasPorPagarMock(), esDemo: true };
  }
  try {
    return { datos: await real.getCuentasPorPagar(), esDemo: false };
  } catch (error) {
    console.error("Falló la consulta real de cuentas por pagar:", error);
    return { datos: mock.getCuentasPorPagarMock(), esDemo: true };
  }
}

export async function cuentasPorCobrar(): Promise<{
  datos: { total: number; movimientos: MovimientoPendiente[] };
  esDemo: boolean;
}> {
  if (!isBigQueryConfigured()) {
    return { datos: mock.getCuentasPorCobrarMock(), esDemo: true };
  }
  try {
    return { datos: await real.getCuentasPorCobrar(), esDemo: false };
  } catch (error) {
    console.error("Falló la consulta real de cuentas por cobrar:", error);
    return { datos: mock.getCuentasPorCobrarMock(), esDemo: true };
  }
}

export async function montoTotalOtoch(): Promise<{ datos: number; esDemo: boolean }> {
  if (!isBigQueryConfigured()) {
    return { datos: mock.getMontoTotalOtochMock(), esDemo: true };
  }
  try {
    return { datos: await real.getMontoTotalOtoch(), esDemo: false };
  } catch (error) {
    console.error("Falló la consulta real de monto total OTOCH:", error);
    return { datos: mock.getMontoTotalOtochMock(), esDemo: true };
  }
}

export async function impuestosDetalle(): Promise<{
  datos: PagoImpuesto[];
  esDemo: boolean;
}> {
  if (!isBigQueryConfigured()) {
    return { datos: mock.getImpuestosDetalleMock(), esDemo: true };
  }
  try {
    return { datos: await real.getImpuestosDetalle(), esDemo: false };
  } catch (error) {
    console.error("Falló la consulta real de detalle de impuestos:", error);
    return { datos: mock.getImpuestosDetalleMock(), esDemo: true };
  }
}
