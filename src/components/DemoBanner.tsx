export function DemoBanner() {
  return (
    <div className="mb-8 rounded-xl border border-dashed border-otoch-violeta/40 bg-otoch-violeta/5 px-4 py-3 text-sm text-otoch-tinta/70">
      <span className="font-display mr-2 text-otoch-violeta">Modo demo</span>
      Estos números son de ejemplo — BigQuery todavía no está conectado.
      Conéctalo (ver README) para ver los datos reales de OTOCH.
    </div>
  );
}
