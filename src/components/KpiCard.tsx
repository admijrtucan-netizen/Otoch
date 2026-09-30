import { formatMoney } from "@/lib/format";

export function KpiCard({
  label,
  value,
  subtitulo,
  icon: Icon,
  accent,
  grande,
}: {
  label: string;
  value: number;
  subtitulo?: string;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: "positivo" | "negativo" | "neutral";
  grande?: boolean;
}) {
  const color =
    accent === "positivo"
      ? "text-otoch-turquesa-dark"
      : accent === "negativo"
        ? "text-otoch-magenta-dark"
        : "text-otoch-tinta";

  const iconBg =
    accent === "positivo"
      ? "bg-otoch-turquesa/12 text-otoch-turquesa-dark"
      : accent === "negativo"
        ? "bg-otoch-magenta/12 text-otoch-magenta-dark"
        : "bg-otoch-violeta/12 text-otoch-violeta";

  return (
    <div className="rounded-2xl border border-otoch-turquesa/15 bg-white/70 px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-otoch-tinta/50">
            {label}
          </p>
          <p
            className={`font-display ${grande ? "text-3xl" : "text-2xl"} ${color}`}
          >
            {formatMoney(value)}
          </p>
          {subtitulo && (
            <p className="mt-1 text-xs text-otoch-tinta/45">{subtitulo}</p>
          )}
        </div>
        {Icon && (
          <div className={`shrink-0 rounded-xl p-2.5 ${iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
