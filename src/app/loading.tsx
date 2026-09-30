export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-otoch-marfil">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-otoch-turquesa/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-otoch-turquesa border-r-otoch-magenta" />
      </div>
      <p className="font-display text-xs tracking-[0.2em] text-otoch-tinta/40">
        CARGANDO DATOS EN VIVO…
      </p>
    </div>
  );
}
