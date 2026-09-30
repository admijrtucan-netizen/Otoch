"use client";

import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/components/sidebar-context";
import { IconMenu } from "@/components/icons";

export function TopNav() {
  const { setMobileOpen } = useSidebar();

  return (
    <header className="sticky top-0 z-10 border-b border-otoch-turquesa/15 bg-otoch-marfil/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-otoch-tinta/60 hover:bg-otoch-tinta/5 sm:hidden"
          >
            <IconMenu className="h-5 w-5" />
          </button>
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
        </div>

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
