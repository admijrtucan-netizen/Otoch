import { notFound } from "next/navigation";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { KpiCard } from "@/components/KpiCard";
import { MonthlyChart } from "@/components/MonthlyChart";
import { RankedList } from "@/components/RankedList";
import { DemoBanner } from "@/components/DemoBanner";
import { getEmpresaBySlug } from "@/lib/otoch/empresas";
import { categorias, serieMensual, topProveedores } from "@/lib/otoch/data";

// La base se actualiza sola (Sheet en vivo detrás de BigQuery) — cada visita
// debe volver a consultar, nunca servir una versión congelada del build.
export const dynamic = "force-dynamic";

export default async function EmpresaPage({
  params,
}: {
  params: Promise<{ empresa: string }>;
}) {
  const { empresa: slug } = await params;
  const empresa = getEmpresaBySlug(slug);
  if (!empresa) notFound();

  const [serie, cats, provs] = await Promise.all([
    serieMensual(empresa.nombreEnBase),
    categorias(empresa.nombreEnBase),
    topProveedores(empresa.nombreEnBase),
  ]);

  const esDemo = serie.esDemo || cats.esDemo || provs.esDemo;

  const totalIngresos = serie.datos.reduce((a, d) => a + d.ingresos, 0);
  const totalEgresos = serie.datos.reduce((a, d) => a + d.egresos, 0);

  return (
    <div className="flex flex-1 flex-col">
      <TopNav />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12">
        <Link
          href="/"
          className="mb-6 inline-block w-fit text-xs font-medium text-otoch-tinta/50 hover:text-otoch-magenta"
        >
          ← Todas las líneas de negocio
        </Link>

        <div className="mb-8">
          <p
            className="font-display mb-1 text-xs tracking-[0.2em]"
            style={{ color: empresa.color }}
          >
            {empresa.descripcion}
          </p>
          <h1 className="font-display text-3xl text-otoch-tinta sm:text-4xl">
            {empresa.nombreCorto}
          </h1>
        </div>

        {esDemo && <DemoBanner />}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Ingresos" value={totalIngresos} accent="positivo" />
          <KpiCard label="Egresos" value={totalEgresos} accent="negativo" />
          <KpiCard label="Flujo neto" value={totalIngresos - totalEgresos} />
        </div>

        <div className="mb-6">
          <MonthlyChart datos={serie.datos} color={empresa.color} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <RankedList
            title="Por categoría"
            items={cats.datos.map((c) => ({ label: c.categoria, total: c.total }))}
            color={empresa.color}
          />
          <RankedList
            title="Principales proveedores"
            items={provs.datos.map((p) => ({ label: p.proveedor, total: p.total }))}
            color={empresa.color}
          />
        </div>
      </main>
    </div>
  );
}
