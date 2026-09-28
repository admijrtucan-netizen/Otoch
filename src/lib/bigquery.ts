import "server-only";
import { BigQuery } from "@google-cloud/bigquery";

/**
 * Cliente de BigQuery para el proyecto "bases-de-datos-sheets", dataset
 * Clientes_Admin_Tucan (tabla Otoch_CONTROL y las que se sumen).
 *
 * Credenciales: la cuenta de servicio se pasa completa como JSON en la
 * variable de entorno GOOGLE_APPLICATION_CREDENTIALS_JSON (no como archivo,
 * para que funcione igual en local y en el hosting). Ver .env.example.
 */
let client: BigQuery | null = null;

function getClient(): BigQuery {
  if (client) return client;

  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!credentialsJson) {
    throw new Error(
      "Falta GOOGLE_APPLICATION_CREDENTIALS_JSON — pega el JSON completo de la cuenta de servicio."
    );
  }

  const credentials = JSON.parse(credentialsJson);
  client = new BigQuery({
    projectId: process.env.BIGQUERY_PROJECT_ID ?? "bases-de-datos-sheets",
    credentials,
  });
  return client;
}

export async function runQuery<T = Record<string, unknown>>(
  query: string,
  params?: Record<string, unknown>
): Promise<T[]> {
  const bigquery = getClient();
  const [rows] = await bigquery.query({ query, params });
  return rows as T[];
}

export const DATASET = process.env.BIGQUERY_DATASET ?? "Clientes_Admin_Tucan";
