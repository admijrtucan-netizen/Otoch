import { TopNav } from "@/components/TopNav";
import { EmpresaCard } from "@/components/EmpresaCard";
import { KpiCard } from "@/components/KpiCard";
import { DemoBanner } from "@/components/DemoBanner";
import { EMPRESAS } from "@/lib/otoch/empresas";
import { resumenPorEmpresa } from "@/lib/otoch/data";

// La base se actualiza sola (Sheet en vivo detrás de BigQuery) — cada visita
// debe volver a consultar, nunca servir una versión congelada del build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { datos, esDemo } = await resumenPorEmpresa();
  const porNombre = new Map(datos.map((d) => [d.empresa, d]));

  const totalIngresos = datos.reduce((acc, d) => acc + d.ingresos, 0);
  const totalEgresos = datos.reduce((acc, d) => acc + d.egresos, 0);
  const totalNeto = totalIngresos - totalEgresos;

  return (
    <div className="flex flex-1 flex-col">
      <TopNav />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12">
        <div className="mb-8">
          <p className="font-display mb-1 text-xs tracking-[0.2em] text-otoch-magenta">
            Panel de control · OTOCH COLIBRÍ
          </p>
          <h1 className="font-display text-3xl text-otoch-tinta sm:text-4xl">
            Las tres líneas de negocio, de un vistazo
          </h1>
        </div>

        {esDemo && <DemoBanner />}

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Ingresos totales" value={totalIngresos} accent="positivo" />
          <KpiCard label="Egresos totales" value={totalEgresos} accent="negativo" />
          <KpiCard label="Flujo neto" value={totalNeto} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {EMPRESAS.map((empresa) => (
            <EmpresaCard
              key={empresa.slug}
              empresa={empresa}
              resumen={porNombre.get(empresa.nombreEnBase)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
