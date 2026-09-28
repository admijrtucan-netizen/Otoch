export const SESSION_COOKIE = "otoch_session";

/**
 * El valor de la cookie es el propio secreto de sesión (no la contraseña que
 * escribe la persona), para que una cookie robada no revele la contraseña.
 * Se compara contra la variable de entorno SESSION_SECRET, generada una sola
 * vez y guardada en el hosting (ver .env.example).
 */
export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Falta configurar SESSION_SECRET en las variables de entorno.");
  }
  return secret;
}

export function getDashboardPassword(): string {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    throw new Error("Falta configurar DASHBOARD_PASSWORD en las variables de entorno.");
  }
  return password;
}

export function isValidSessionCookie(value: string | undefined): boolean {
  if (!value) return false;
  try {
    return value === getSessionSecret();
  } catch {
    return false;
  }
}
