import Image from "next/image";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const params = await searchParams;
  const from = params.from ?? "/";
  const hasError = params.error === "1";
  const hasConfigError = params.error === "config";

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <Image
            src="/logo-otoch.png"
            alt="OTOCH COLIBRÍ"
            width={220}
            height={220}
            priority
            className="h-auto w-56"
          />
        </div>

        <form
          action="/api/login"
          method="POST"
          className="rounded-2xl border border-otoch-turquesa/20 bg-white/70 p-8 shadow-sm backdrop-blur-sm"
        >
          <input type="hidden" name="from" value={from} />

          <h1 className="font-display mb-1 text-xl text-otoch-tinta">
            Acceso al panel
          </h1>
          <p className="mb-6 text-sm text-otoch-tinta/60">
            Escribe la contraseña compartida del equipo para entrar.
          </p>

          <label className="mb-2 block text-sm font-medium text-otoch-tinta/80">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            autoFocus
            required
            className="mb-4 w-full rounded-lg border border-otoch-tinta/15 bg-white px-4 py-2.5 text-otoch-tinta outline-none ring-otoch-turquesa focus:ring-2"
          />

          {hasError && (
            <p className="mb-4 text-sm text-otoch-magenta">
              Contraseña incorrecta. Intenta de nuevo.
            </p>
          )}
          {hasConfigError && (
            <p className="mb-4 text-sm text-otoch-magenta">
              El panel todavía no está configurado (faltan variables de
              entorno). Avísale a quien lo desplegó.
            </p>
          )}

          <button
            type="submit"
            className="font-display w-full rounded-lg bg-otoch-magenta px-4 py-2.5 text-sm text-white transition-colors hover:bg-otoch-magenta-dark"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
