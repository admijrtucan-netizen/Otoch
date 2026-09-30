import type { MovimientoPendiente } from "@/lib/otoch/types";
import { formatMoney } from "@/lib/format";

export function CuentaPendienteCard({
  titulo,
  subtitulo,
  total,
  movimientos,
  color,
}: {
  titulo: string;
  subtitulo: string;
  total: number;
  movimientos: MovimientoPendiente[];
  color: string;
}) {
  return (
    <div
      className="rounded-2xl border border-otoch-turquesa/15 bg-white/70 p-5"
      style={{ borderTopColor: color, borderTopWidth: 3 }}
    >
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-otoch-tinta/50">
        {titulo}
      </p>
      <p className="font-display mb-3 text-2xl text-otoch-tinta">
        {formatMoney(total)}
      </p>
      <p className="mb-3 text-xs text-otoch-tinta/50">{subtitulo}</p>

      {movimientos.length === 0 ? (
        <p className="text-sm text-otoch-tinta/40">Sin movimientos pendientes.</p>
      ) : (
        <ul className="space-y-2 border-t border-otoch-tinta/10 pt-3">
          {movimientos.map((m, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <div className="pr-3">
                <p className="text-otoch-tinta/80">{m.contraparte}</p>
                <p className="text-xs text-otoch-tinta/45">{m.concepto}</p>
              </div>
              <span className="whitespace-nowrap font-medium text-otoch-tinta">
                {formatMoney(m.monto)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
