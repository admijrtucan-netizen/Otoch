import { calcularUtilidades } from "@/lib/otoch/types";
import type { EstadoDeResultados } from "@/lib/otoch/types";
import { formatMoney } from "@/lib/format";

function Renglon({
  label,
  value,
  bold,
  indent,
}: {
  label: string;
  value: number;
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
    </div>
  );
}

export function UtilidadWaterfall({ pyl }: { pyl: EstadoDeResultados }) {
  const u = calcularUtilidades(pyl);

  return (
    <div className="rounded-2xl border border-otoch-turquesa/15 bg-white/70 p-5">
      <h3 className="font-display mb-3 text-sm text-otoch-tinta/70">
        Estado de resultados
      </h3>
      <Renglon label="Ventas" value={u.ventas} />
      <Renglon label="Costo de venta" value={-u.costoVenta} indent />
      <Renglon label="Utilidad bruta" value={u.utilidadBruta} bold />
      <Renglon label="Gastos de administración" value={-u.gastosAdmin} indent />
      <Renglon label="Gastos de venta" value={-u.gastosVenta} indent />
      <Renglon label="Utilidad operativa" value={u.utilidadOperativa} bold />
      <Renglon label="Gastos financieros" value={-u.gastosFinancieros} indent />
      {(u.otrosIngresos !== 0 || u.otrosGastos !== 0) && (
        <Renglon
          label="Otros ingresos y gastos"
          value={u.otrosIngresos - u.otrosGastos}
          indent
        />
      )}
      <Renglon label="Impuestos" value={-u.impuestos} indent />
      <Renglon label="Utilidad neta" value={u.utilidadNeta} bold />
    </div>
  );
}
