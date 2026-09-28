import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, isValidSessionCookie } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;

  if (isValidSessionCookie(cookie)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Protege todo excepto la página de login, el endpoint de login/logout,
  // y los archivos estáticos (imágenes, fuentes, favicon).
  matcher: [
    "/((?!login|api/login|api/logout|_next/static|_next/image|favicon.ico|logo-otoch.png|logo-otoch-blanco.webp).*)",
  ],
};
