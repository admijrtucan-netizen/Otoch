# OTOCH · Panel de control

Dashboard propio (no Google Apps Script) para centralizar la base de
BigQuery de **OTOCH COLIBRÍ** y mostrarla en vivo, con la marca de OTOCH
aplicada a fondo. Pensado para que la dueña y el equipo lo abran desde
cualquier navegador con un link + una contraseña compartida — sin depender
de una cuenta de Google específica.

Documentación de negocio y de marca (paleta, tipografía, tono): ver el
proyecto `otoch` en Cerebro Tucán (Brain OS del equipo),
`proyectos/otoch/semantico.md` y `proyectos/otoch/marca/`.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4.
- **@google-cloud/bigquery** para consultar en vivo el dataset
  `Clientes_Admin_Tucan` del proyecto `bases-de-datos-sheets` (tabla
  `Otoch_CONTROL` como punto de partida).
- Protección por contraseña compartida (cookie de sesión firmada), sin login
  de Google ni cuentas individuales.
- Pensado para desplegarse en Vercel (el build está optimizado para eso),
  pero no depende de nada propietario de Vercel.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # y llena las variables (ver abajo)
npm run dev
```

Abre http://localhost:3000 — pide la contraseña de `DASHBOARD_PASSWORD`.

## Variables de entorno

Ver `.env.example` para la lista completa. Resumen:

| Variable | Para qué |
|---|---|
| `DASHBOARD_PASSWORD` | La contraseña que escribe el equipo para entrar. |
| `SESSION_SECRET` | Secreto propio para firmar la cookie de sesión (`openssl rand -hex 32`). |
| `BIGQUERY_PROJECT_ID` | Proyecto de GCP (`bases-de-datos-sheets`). |
| `BIGQUERY_DATASET` | Dataset de OTOCH (`Clientes_Admin_Tucan`). |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | JSON completo de una cuenta de servicio con lectura sobre ese dataset. |

**La cuenta de servicio de BigQuery hay que crearla en Google Cloud Console**
(IAM → Cuentas de servicio → nueva → rol `BigQuery Data Viewer` +
`BigQuery Job User` sobre el proyecto `bases-de-datos-sheets`, o al menos
sobre el dataset `Clientes_Admin_Tucan`) y generarle una llave JSON. Ese JSON
nunca se sube al repo — solo vive como variable de entorno en el hosting.

## Despliegue

Pensado para Vercel:

1. Conectar este repo de GitHub a un proyecto de Vercel.
2. Cargar las 5 variables de entorno de la tabla de arriba en
   *Project Settings → Environment Variables*.
3. Deploy. Vercel construye con `npm run build` automáticamente.

El acceso público del sitio queda protegido por `DASHBOARD_PASSWORD` — no
hace falta configurar nada extra de Vercel para eso.

## Marca

Los tokens de color y tipografía viven como variables CSS en
`src/app/globals.css` (`--otoch-turquesa`, `--otoch-magenta`,
`--otoch-violeta`, `--otoch-marfil`) y como clases de Tailwind
(`bg-otoch-turquesa`, `text-otoch-magenta`, etc.). Tipografía: Oswald para
títulos/display, Inter para texto — cargadas vía `next/font/google`.

## Estado

- [x] Esqueleto de la app, marca aplicada, login con contraseña compartida.
- [ ] Conexión real a BigQuery (pendiente reconectar el acceso).
- [ ] Mapeo de las líneas de negocio reales (columna "Empresa").
- [ ] Dashboards por línea de negocio.
