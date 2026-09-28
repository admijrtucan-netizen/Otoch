import { formatMoney } from "@/lib/format";

export function RankedList({
  title,
  items,
  color,
}: {
  title: string;
  items: { label: string; total: number }[];
  color: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.total));

  return (
    <div className="rounded-2xl border border-otoch-turquesa/15 bg-white/70 p-5">
      <h3 className="font-display mb-4 text-sm text-otoch-tinta/70">{title}</h3>
      {items.length === 0 && (
        <p className="text-sm text-otoch-tinta/40">Sin datos todavía.</p>
      )}
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-otoch-tinta/80">{item.label}</span>
              <span className="font-medium text-otoch-tinta">
                {formatMoney(item.total)}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-otoch-tinta/8">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(item.total / max) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
