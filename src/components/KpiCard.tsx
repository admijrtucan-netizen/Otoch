import { formatMoney } from "@/lib/format";

export function KpiCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "positivo" | "negativo" | "neutral";
}) {
  const color =
    accent === "positivo"
      ? "text-otoch-turquesa-dark"
      : accent === "negativo"
        ? "text-otoch-magenta-dark"
        : "text-otoch-tinta";

  return (
    <div className="rounded-2xl border border-otoch-turquesa/15 bg-white/70 px-5 py-4">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-otoch-tinta/50">
        {label}
      </p>
      <p className={`font-display text-2xl ${color}`}>{formatMoney(value)}</p>
    </div>
  );
}
