"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EMPRESAS } from "@/lib/otoch/empresas";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const activo = pathname === href;
  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
        activo
          ? "bg-otoch-turquesa/15 font-medium text-otoch-turquesa-dark"
          : "text-otoch-tinta/70 hover:bg-otoch-tinta/5 hover:text-otoch-tinta"
      }`}
    >
      {children}
    </Link>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="font-display mb-2 px-3 text-xs tracking-[0.15em] text-otoch-tinta/40">
        {titulo}
      </p>
      <nav className="space-y-0.5">{children}</nav>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-otoch-turquesa/15 px-3 py-8 sm:block">
      <Grupo titulo="Comercial">
        <NavLink href="/">Resumen</NavLink>
        {EMPRESAS.map((e) => (
          <NavLink key={e.slug} href={`/${e.slug}`}>
            {e.nombreCorto}
          </NavLink>
        ))}
      </Grupo>

      <Grupo titulo="Administrativa">
        <NavLink href="/finanzas">Finanzas</NavLink>
        <NavLink href="/finanzas/impuestos">Impuestos</NavLink>
      </Grupo>
    </aside>
  );
}
