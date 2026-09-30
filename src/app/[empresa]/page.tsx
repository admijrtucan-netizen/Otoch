import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { KpiCard } from "@/components/KpiCard";
import { MonthlyChart } from "@/components/MonthlyChart";
import { RankedList } from "@/components/RankedList";
import { ObraTable } from "@/components/ObraTable";
import { UtilidadWaterfall } from "@/components/UtilidadWaterfall";
import { DemoBanner } from "@/components/DemoBanner";
import { getEmpresaBySlug } from "@/lib/otoch/empresas";
import {
  categorias,
  estadoDeResultados,
  porObra,
  serieMensual,
  topProveedores,
} from "@/lib/otoch/data";

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

  // En serie a propósito, no Promise.all — ver nota en app/page.tsx sobre
  // consultas simultáneas saturando el Google Sheet detrás de la tabla externa.
  const serie = await serieMensual(empresa.nombreEnBase);
  const cats = await categorias(empresa.nombreEnBase);
  const provs = await topProveedores(empresa.nombreEnBase);
  const pyl = await estadoDeResultados(empresa.nombreEnBase);
  const obras = await porObra(empresa.nombreEnBase);

  const esDemo =
    serie.esDemo || cats.esDemo || provs.esDemo || pyl.esDemo || obras.esDemo;

  const totalIngresos = serie.datos.reduce((a, d) => a + d.ingresos, 0);
  const totalEgresos = serie.datos.reduce((a, d) => a + d.egresos, 0);

  return (
    <AppShell>
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
          <KpiCard label="Cobros" value={totalIngresos} accent="positivo" />
          <KpiCard label="Pagos" value={totalEgresos} accent="negativo" />
          <KpiCard label="Flujo neto" value={totalIngresos - totalEgresos} />
        </div>

        <div className="mb-2">
          <h2 className="font-display text-lg text-otoch-tinta">
            Flujo de efectivo mensual
          </h2>
          <p className="text-sm text-otoch-tinta/50">
            Cobros y pagos reales, mes a mes.
          </p>
        </div>
        <div className="mb-10">
          <MonthlyChart datos={serie.datos} color={empresa.color} />
        </div>

        <div className="mb-2">
          <h2 className="font-display text-lg text-otoch-tinta">
            Utilidad de la línea
          </h2>
          <p className="text-sm text-otoch-tinta/50">
            De ventas a utilidad neta, con el estado de resultados de esta línea.
          </p>
        </div>
        <div className="mb-10">
          <UtilidadWaterfall pyl={pyl.datos} />
        </div>

        <div className="mb-2">
          <h2 className="font-display text-lg text-otoch-tinta">Por obra</h2>
          <p className="text-sm text-otoch-tinta/50">
            Ingresos y egresos por propiedad/proyecto dentro de esta línea.
          </p>
        </div>
        <div className="mb-10">
          <ObraTable obras={obras.datos} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <RankedList
            title="Principales gastos por categoría"
            items={cats.datos.map((c) => ({ label: c.categoria, total: c.total }))}
            color={empresa.color}
          />
          <RankedList
            title="Principales proveedores"
            items={provs.datos.map((p) => ({ label: p.proveedor, total: p.total }))}
            color={empresa.color}
          />
        </div>
    </AppShell>
  );
}
