import { AppShell } from "@/components/AppShell";
import { EmpresaCard } from "@/components/EmpresaCard";
import { DemoBanner } from "@/components/DemoBanner";
import { EMPRESAS } from "@/lib/otoch/empresas";
import { resumenPorEmpresa } from "@/lib/otoch/data";

// La base se actualiza sola (Sheet en vivo detrás de BigQuery) — cada visita
// debe volver a consultar, nunca servir una versión congelada del build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const resumen = await resumenPorEmpresa();
  const porNombre = new Map(resumen.datos.map((d) => [d.empresa, d]));

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-display mb-1 text-xs tracking-[0.2em] text-otoch-magenta">
          Comercial · OTOCH COLIBRÍ
        </p>
        <h1 className="font-display text-3xl text-otoch-tinta sm:text-4xl">
          Las tres líneas de negocio, de un vistazo
        </h1>
      </div>

      {resumen.esDemo && <DemoBanner />}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {EMPRESAS.map((empresa) => (
          <EmpresaCard
            key={empresa.slug}
            empresa={empresa}
            resumen={porNombre.get(empresa.nombreEnBase)}
          />
        ))}
      </div>
    </AppShell>
  );
}
