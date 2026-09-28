import Image from "next/image";
import Link from "next/link";

export function TopNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-otoch-turquesa/15 bg-otoch-marfil/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-otoch.png"
            alt="OTOCH COLIBRÍ"
            width={140}
            height={140}
            priority
            className="h-10 w-auto"
          />
          <span className="font-display hidden text-sm tracking-widest text-otoch-tinta/50 sm:inline">
            Control
          </span>
        </Link>

        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="rounded-full border border-otoch-tinta/15 px-4 py-1.5 text-xs font-medium text-otoch-tinta/60 transition-colors hover:border-otoch-magenta/40 hover:text-otoch-magenta"
          >
            Salir
          </button>
        </form>
      </div>
    </header>
  );
}
