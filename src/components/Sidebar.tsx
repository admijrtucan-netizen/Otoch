"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EMPRESAS } from "@/lib/otoch/empresas";
import { useSidebar } from "@/components/sidebar-context";
import {
  IconBag,
  IconBuilding,
  IconChevronsLeft,
  IconChevronsRight,
  IconHome,
  IconPalette,
  IconReceipt,
  IconWallet,
  IconX,
} from "@/components/icons";

const ICONO_POR_SLUG: Record<string, React.ComponentType<{ className?: string }>> = {
  colibri: IconBag,
  interiorismo: IconPalette,
  propiedades: IconBuilding,
};

function NavLink({
  href,
  icon: Icon,
  children,
  colapsado,
  onNavigate,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  colapsado: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activo = pathname === href;
  return (
    <Link
      href={href}
      title={colapsado ? String(children) : undefined}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        activo
          ? "bg-otoch-turquesa/15 font-medium text-otoch-turquesa-dark"
          : "text-otoch-tinta/70 hover:bg-otoch-tinta/5 hover:text-otoch-tinta"
      } ${colapsado ? "justify-center" : ""}`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!colapsado && <span>{children}</span>}
    </Link>
  );
}

function Grupo({
  titulo,
  colapsado,
  children,
}: {
  titulo: string;
  colapsado: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {!colapsado && (
        <p className="font-display mb-2 px-3 text-xs tracking-[0.15em] text-otoch-tinta/40">
          {titulo}
        </p>
      )}
      <nav className="space-y-0.5">{children}</nav>
    </div>
  );
}

function Contenido({
  colapsado,
  onNavigate,
}: {
  colapsado: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      <Grupo titulo="Comercial" colapsado={colapsado}>
        <NavLink href="/" icon={IconHome} colapsado={colapsado} onNavigate={onNavigate}>
          Resumen
        </NavLink>
        {EMPRESAS.map((e) => (
          <NavLink
            key={e.slug}
            href={`/${e.slug}`}
            icon={ICONO_POR_SLUG[e.slug] ?? IconHome}
            colapsado={colapsado}
            onNavigate={onNavigate}
          >
            {e.nombreCorto}
          </NavLink>
        ))}
      </Grupo>

      <Grupo titulo="Administrativa" colapsado={colapsado}>
        <NavLink href="/finanzas" icon={IconWallet} colapsado={colapsado} onNavigate={onNavigate}>
          Finanzas
        </NavLink>
        <NavLink
          href="/finanzas/impuestos"
          icon={IconReceipt}
          colapsado={colapsado}
          onNavigate={onNavigate}
        >
          Impuestos
        </NavLink>
      </Grupo>
    </>
  );
}

export function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Desktop: columna fija, se puede colapsar a solo íconos */}
      <aside
        className={`hidden shrink-0 self-start border-r border-otoch-turquesa/15 py-8 transition-[width] duration-150 sm:block ${
          collapsed ? "w-16 px-2" : "w-56 px-3"
        }`}
      >
        <Contenido colapsado={collapsed} />
        <button
          type="button"
          onClick={toggleCollapsed}
          title={collapsed ? "Expandir menú" : "Reducir menú"}
          className="mt-4 flex w-full items-center justify-center rounded-lg px-3 py-2 text-otoch-tinta/40 transition-colors hover:bg-otoch-tinta/5 hover:text-otoch-tinta"
        >
          {collapsed ? (
            <IconChevronsRight className="h-4 w-4" />
          ) : (
            <IconChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </aside>

      {/* Móvil: overlay que se abre desde el botón de hamburguesa del TopNav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 sm:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-otoch-tinta/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 overflow-y-auto bg-otoch-marfil px-3 py-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="font-display text-xs tracking-[0.2em] text-otoch-tinta/50">
                MENÚ
              </span>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-1.5 text-otoch-tinta/50 hover:bg-otoch-tinta/5"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>
            <Contenido colapsado={false} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
