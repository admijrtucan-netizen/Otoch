import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { KpiCard } from "@/components/KpiCard";
import { DemoBanner } from "@/components/DemoBanner";
import { formatMoney } from "@/lib/format";
import { impuestosDetalle } from "@/lib/otoch/data";

export const dynamic = "force-dynamic";

export default async function ImpuestosPage() {
  const { datos, esDemo } = await impuestosDetalle();
  const total = datos.reduce((a, p) => a + p.monto, 0);

  return (
    <AppShell>
      <Link
        href="/finanzas"
        className="mb-6 inline-block w-fit text-xs font-medium text-otoch-tinta/50 hover:text-otoch-magenta"
      >
        ← Finanzas
      </Link>

      <div className="mb-8">
        <p className="font-display mb-1 text-xs tracking-[0.2em] text-otoch-magenta">
          Administrativa · OTOCH COLIBRÍ
        </p>
        <h1 className="font-display text-3xl text-otoch-tinta sm:text-4xl">
          Impuestos pagados al SAT
        </h1>
      </div>

      {esDemo && <DemoBanner />}

      <div className="mb-8 max-w-xs">
        <KpiCard label="Total pagado" value={total} accent="negativo" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-otoch-turquesa/15 bg-white/70">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-otoch-tinta/10 text-left text-xs uppercase tracking-wide text-otoch-tinta/50">
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Línea de negocio</th>
              <th className="px-4 py-3 font-medium">Concepto</th>
              <th className="px-4 py-3 text-right font-medium">Monto</th>
            </tr>
          </thead>
          <tbody>
            {datos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-otoch-tinta/40">
                  Sin pagos registrados.
                </td>
              </tr>
            )}
            {datos.map((p, i) => (
              <tr key={i} className="border-b border-otoch-tinta/5 last:border-0">
                <td className="px-4 py-3 text-otoch-tinta/70">{p.fecha}</td>
                <td className="px-4 py-3 text-otoch-tinta/70">{p.empresa}</td>
                <td className="px-4 py-3 text-otoch-tinta/70">{p.concepto}</td>
                <td className="px-4 py-3 text-right font-medium text-otoch-magenta-dark">
                  {formatMoney(p.monto)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
