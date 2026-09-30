import { calcularUtilidades } from "@/lib/otoch/types";
import type { EstadoDeResultados } from "@/lib/otoch/types";
import { formatMoney } from "@/lib/format";

function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

function Renglon({
  label,
  value,
  pct,
  bold,
  indent,
}: {
  label: string;
  value: number;
  pct?: number;
  bold?: boolean;
  indent?: boolean;
}) {
  const negativo = value < 0;
  return (
    <div
      className={`flex items-center justify-between py-2 ${
        bold ? "border-t border-otoch-tinta/15 pt-3" : ""
      } ${indent ? "pl-4" : ""}`}
    >
      <span
        className={
          bold
            ? "font-display text-sm text-otoch-tinta"
            : "text-sm text-otoch-tinta/70"
        }
      >
        {label}
      </span>
      <span className="flex items-baseline gap-2">
        {pct !== undefined && (
          <span className="text-xs text-otoch-tinta/40">{formatPct(pct)}</span>
        )}
        <span
          className={`font-display text-sm ${
            bold
              ? negativo
                ? "text-otoch-magenta-dark"
                : "text-otoch-turquesa-dark"
              : "text-otoch-tinta/80"
          }`}
        >
          {formatMoney(value)}
        </span>
      </span>
    </div>
  );
}

export function UtilidadWaterfall({ pyl }: { pyl: EstadoDeResultados }) {
  const u = calcularUtilidades(pyl);
  // % sobre ventas — el estándar para leer un estado de resultados (margen
  // bruto, margen operativo, margen neto). Si no hubo ventas en el periodo,
  // no se calcula (dividir entre cero no informa nada útil).
  const pctVentas = u.ventas !== 0 ? (v: number) => (v / u.ventas) * 100 : undefined;

  return (
    <div className="rounded-2xl border border-otoch-turquesa/15 bg-white/70 p-5">
      <h3 className="font-display mb-3 text-sm text-otoch-tinta/70">
        Estado de resultados
      </h3>
      <Renglon label="Ventas" value={u.ventas} pct={pctVentas?.(u.ventas)} />
      <Renglon
        label="Costo de venta"
        value={-u.costoVenta}
        pct={pctVentas?.(-u.costoVenta)}
        indent
      />
      <Renglon
        label="Utilidad bruta"
        value={u.utilidadBruta}
        pct={pctVentas?.(u.utilidadBruta)}
        bold
      />
      <Renglon
        label="Gastos de administración"
        value={-u.gastosAdmin}
        pct={pctVentas?.(-u.gastosAdmin)}
        indent
      />
      <Renglon
        label="Gastos de venta"
        value={-u.gastosVenta}
        pct={pctVentas?.(-u.gastosVenta)}
        indent
      />
      <Renglon
        label="Utilidad operativa"
        value={u.utilidadOperativa}
        pct={pctVentas?.(u.utilidadOperativa)}
        bold
      />
      <Renglon
        label="Gastos financieros"
        value={-u.gastosFinancieros}
        pct={pctVentas?.(-u.gastosFinancieros)}
        indent
      />
      {(u.otrosIngresos !== 0 || u.otrosGastos !== 0) && (
        <Renglon
          label="Otros ingresos y gastos"
          value={u.otrosIngresos - u.otrosGastos}
          pct={pctVentas?.(u.otrosIngresos - u.otrosGastos)}
          indent
        />
      )}
      <Renglon
        label="Impuestos"
        value={-u.impuestos}
        pct={pctVentas?.(-u.impuestos)}
        indent
      />
      <Renglon
        label="Utilidad neta"
        value={u.utilidadNeta}
        pct={pctVentas?.(u.utilidadNeta)}
        bold
      />
      {!pctVentas && (
        <p className="mt-3 text-xs text-otoch-tinta/40">
          Sin ventas registradas en el periodo — los % de margen no aplican.
        </p>
      )}
    </div>
  );
}
