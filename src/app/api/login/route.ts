import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, getDashboardPassword, getSessionSecret } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const from = String(form.get("from") ?? "/");

  let expected: string;
  let secret: string;
  try {
    expected = getDashboardPassword();
    secret = getSessionSecret();
  } catch {
    return NextResponse.redirect(
      new URL(`/login?error=config&from=${encodeURIComponent(from)}`, request.url)
    );
  }

  if (password !== expected) {
    return NextResponse.redirect(
      new URL(`/login?error=1&from=${encodeURIComponent(from)}`, request.url)
    );
  }

  const response = NextResponse.redirect(new URL(from || "/", request.url));
  response.cookies.set(SESSION_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });
  return response;
}
