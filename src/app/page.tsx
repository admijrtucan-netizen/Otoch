import { TopNav } from "@/components/TopNav";

const proximosPasos = [
  "Reconectar el acceso a BigQuery (bases-de-datos-sheets · Clientes_Admin_Tucan · Otoch_CONTROL).",
  "Mapear las líneas de negocio reales de la columna \"Empresa\".",
  "Diseñar las tarjetas y gráficas por línea de negocio.",
  "Conectar cada tarjeta a su consulta en vivo.",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <TopNav />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12">
        <div className="mb-10">
          <p className="font-display mb-1 text-xs tracking-[0.2em] text-otoch-magenta">
            Panel de control · OTOCH COLIBRÍ
          </p>
          <h1 className="font-display text-3xl text-otoch-tinta sm:text-4xl">
            Listo para conectar los datos
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-otoch-tinta/70">
            Este panel va a mostrar en vivo la información de BigQuery,
            actualizada cada día, con una vista por cada línea de negocio de
            OTOCH. Todavía no hay datos conectados — esto es lo que falta:
          </p>
        </div>

        <ol className="mb-12 space-y-3">
          {proximosPasos.map((paso, i) => (
            <li
              key={paso}
              className="flex items-start gap-3 rounded-xl border border-otoch-turquesa/15 bg-white/60 px-4 py-3"
            >
              <span className="font-display flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-otoch-turquesa text-xs text-white">
                {i + 1}
              </span>
              <span className="text-sm text-otoch-tinta/80">{paso}</span>
            </li>
          ))}
        </ol>

        <div className="mt-auto rounded-2xl border border-dashed border-otoch-violeta/30 bg-otoch-violeta/5 px-6 py-5 text-sm text-otoch-tinta/70">
          Cuando las líneas de negocio estén mapeadas, cada una tendrá aquí su
          propia sección con las gráficas correspondientes — sección
          &ldquo;Listo para habitar&rdquo;.
        </div>
      </main>
    </div>
  );
}
