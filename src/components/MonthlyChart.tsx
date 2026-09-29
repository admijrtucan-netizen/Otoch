"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PuntoMensual } from "@/lib/otoch/types";
import { formatMoney } from "@/lib/format";

const MES_CORTO: Record<number, string> = {
  1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun",
  7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic",
};

export function MonthlyChart({ datos, color }: { datos: PuntoMensual[]; color: string }) {
  const rows = datos.map((d) => ({
    // Incluye el año corto a propósito: si la base llega a traer más de 12
    // meses, dos diciembres de años distintos no deben verse como el mismo.
    mes: `${MES_CORTO[d.ordenMes] ?? "?"} ${String(d.anio).slice(-2)}`,
    Ingresos: d.ingresos,
    Egresos: d.egresos,
  }));

  return (
    <div className="h-72 w-full rounded-2xl border border-otoch-turquesa/15 bg-white/70 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(43,38,34,0.08)" />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 12, fill: "rgba(43,38,34,0.6)" }}
            axisLine={{ stroke: "rgba(43,38,34,0.15)" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "rgba(43,38,34,0.5)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
            }
          />
          <Tooltip
            formatter={(value) => formatMoney(Number(value ?? 0))}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(32,184,197,0.25)",
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Ingresos" fill={color} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Egresos" fill="rgba(43,38,34,0.25)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
