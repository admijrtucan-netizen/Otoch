import Link from "next/link";
import type { EmpresaInfo } from "@/lib/otoch/empresas";
import type { ResumenEmpresa } from "@/lib/otoch/types";
import { formatMoney } from "@/lib/format";

export function EmpresaCard({
  empresa,
  resumen,
}: {
  empresa: EmpresaInfo;
  resumen?: ResumenEmpresa;
}) {
  const neto = resumen?.neto ?? 0;
  const netoPositivo = neto >= 0;

  return (
    <Link
      href={`/${empresa.slug}`}
      className="group block rounded-2xl border border-otoch-turquesa/15 bg-white/70 p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderTopColor: empresa.color, borderTopWidth: 3 }}
    >
      <p className="font-display text-lg text-otoch-tinta">
        {empresa.nombreCorto}
      </p>
      <p className="mb-4 text-sm text-otoch-tinta/60">{empresa.descripcion}</p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-otoch-tinta/50">Ingresos</p>
          <p className="font-medium text-otoch-tinta">
            {formatMoney(resumen?.ingresos ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-otoch-tinta/50">Egresos</p>
          <p className="font-medium text-otoch-tinta">
            {formatMoney(resumen?.egresos ?? 0)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-otoch-tinta/10 pt-3">
        <span className="text-xs uppercase tracking-wide text-otoch-tinta/50">
          Flujo neto
        </span>
        <span
          className={`font-display text-base ${
            netoPositivo ? "text-otoch-turquesa-dark" : "text-otoch-magenta-dark"
          }`}
        >
          {formatMoney(neto)}
        </span>
      </div>

      <p className="mt-4 text-xs font-medium text-otoch-tinta/40 transition-colors group-hover:text-otoch-magenta">
        Ver detalle →
      </p>
    </Link>
  );
}
