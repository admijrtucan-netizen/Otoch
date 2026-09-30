import type { Obra } from "@/lib/otoch/types";
import { formatMoney } from "@/lib/format";

export function ObraTable({ obras }: { obras: Obra[] }) {
  if (obras.length === 0) {
    return (
      <div className="rounded-2xl border border-otoch-turquesa/15 bg-white/70 p-5 text-sm text-otoch-tinta/40">
        Sin obras registradas todavía.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-otoch-turquesa/15 bg-white/70">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-otoch-tinta/10 text-left text-xs uppercase tracking-wide text-otoch-tinta/50">
            <th className="px-4 py-3 font-medium">Obra / propiedad</th>
            <th className="px-4 py-3 text-right font-medium">Ingresos</th>
            <th className="px-4 py-3 text-right font-medium">Egresos</th>
            <th className="px-4 py-3 text-right font-medium">Neto</th>
          </tr>
        </thead>
        <tbody>
          {obras.map((o) => (
            <tr key={o.obra} className="border-b border-otoch-tinta/5 last:border-0">
              <td className="px-4 py-3 text-otoch-tinta/80">{o.obra}</td>
              <td className="px-4 py-3 text-right text-otoch-turquesa-dark">
                {formatMoney(o.ingresos)}
              </td>
              <td className="px-4 py-3 text-right text-otoch-magenta-dark">
                {formatMoney(o.egresos)}
              </td>
              <td
                className={`px-4 py-3 text-right font-medium ${
                  o.neto >= 0 ? "text-otoch-turquesa-dark" : "text-otoch-magenta-dark"
                }`}
              >
                {formatMoney(o.neto)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
