import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { KpiCard } from "@/components/KpiCard";
import { CuentaPendienteCard } from "@/components/CuentaPendienteCard";
import { UtilidadWaterfall } from "@/components/UtilidadWaterfall";
import { DemoBanner } from "@/components/DemoBanner";
import {
  cuentasPorCobrar,
  cuentasPorPagar,
  estadoDeResultados,
  montoTotalOtoch,
} from "@/lib/otoch/data";

// La base se actualiza sola (Sheet en vivo detrás de BigQuery) — cada visita
// debe volver a consultar, nunca servir una versión congelada del build.
export const dynamic = "force-dynamic";

export default async function FinanzasPage() {
  // En serie a propósito, no Promise.all — Otoch_CONTROL es una tabla
  // externa sobre un Google Sheet y varias consultas simultáneas lo saturan
  // ("Resources exceeded... Google Sheets service overloaded").
  const montoOtoch = await montoTotalOtoch();
  const pylTotal = await estadoDeResultados();
  const cxp = await cuentasPorPagar();
  const cxc = await cuentasPorCobrar();

  const esDemo =
    montoOtoch.esDemo || pylTotal.esDemo || cxp.esDemo || cxc.esDemo;

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-display mb-1 text-xs tracking-[0.2em] text-otoch-magenta">
          Administrativa · OTOCH COLIBRÍ
        </p>
        <h1 className="font-display text-3xl text-otoch-tinta sm:text-4xl">
          Finanzas, de un vistazo
        </h1>
      </div>

      {esDemo && <DemoBanner />}

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Dinero OTOCH (suma total)" value={montoOtoch.datos} />

        <Link href="/finanzas/impuestos" className="block">
          <KpiCard
            label="Dinero Impuestos (pagado al SAT) →"
            value={pylTotal.datos.impuestos}
            accent="negativo"
          />
        </Link>

        <CuentaPendienteCard
          titulo="Cuentas por pagar"
          subtitulo="Lo que OTOCH debe (comisiones, servicios de gestión)"
          total={cxp.datos.total}
          movimientos={cxp.datos.movimientos}
          color="var(--otoch-magenta)"
        />

        <CuentaPendienteCard
          titulo="Cuentas por cobrar"
          subtitulo="Lo que le deben a OTOCH (fondos de reserva de clientes)"
          total={cxc.datos.total}
          movimientos={cxc.datos.movimientos}
          color="var(--otoch-turquesa)"
        />
      </div>

      <p className="mb-10 text-xs text-otoch-tinta/40">
        &ldquo;Dinero OTOCH&rdquo; suma únicamente INGRESO, EGRESO y CC
        (cambio de caja), con signo — cuentas por pagar/cobrar quedan
        aparte, en sus propias tarjetas.
      </p>

      <div className="mb-4">
        <h2 className="font-display text-xl text-otoch-tinta">
          Utilidad general
        </h2>
        <p className="text-sm text-otoch-tinta/60">
          Las tres líneas de negocio juntas, de ventas a utilidad neta.
        </p>
      </div>
      <UtilidadWaterfall pyl={pylTotal.datos} />
    </AppShell>
  );
}
