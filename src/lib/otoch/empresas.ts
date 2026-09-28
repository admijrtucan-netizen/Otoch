export type EmpresaSlug = "colibri" | "interiorismo" | "propiedades";

export interface EmpresaInfo {
  slug: EmpresaSlug;
  /** Valor exacto tal como aparece en la columna EMPRESAS de Otoch_CONTROL. */
  nombreEnBase: string;
  nombreCorto: string;
  descripcion: string;
  color: string;
  colorSuave: string;
}

export const EMPRESAS: EmpresaInfo[] = [
  {
    slug: "colibri",
    nombreEnBase: "OTOCH COLIBRI",
    nombreCorto: "Colibrí",
    descripcion: "Personal shopper, curaduría e implementación",
    color: "var(--otoch-turquesa)",
    colorSuave: "rgba(32, 184, 197, 0.12)",
  },
  {
    slug: "interiorismo",
    nombreEnBase: "OTOCH INTERIORISMO",
    nombreCorto: "Interiorismo",
    descripcion: "Diseño y ejecución de espacios",
    color: "var(--otoch-magenta)",
    colorSuave: "rgba(231, 42, 135, 0.10)",
  },
  {
    slug: "propiedades",
    nombreEnBase: "OTOCH ADM PROPIEDADES",
    nombreCorto: "Adm. Propiedades",
    descripcion: "Administración de propiedades y rentas",
    color: "var(--otoch-violeta)",
    colorSuave: "rgba(122, 58, 141, 0.10)",
  },
];

export function getEmpresaBySlug(slug: string): EmpresaInfo | undefined {
  return EMPRESAS.find((e) => e.slug === slug);
}

/**
 * Nota: estos tres nombres se leyeron de la columna EMPRESAS del Sheet real
 * (2026-09-28), vía un resumen automático de un modelo pequeño — no una
 * lectura fila por fila verificada. Si al conectar BigQuery aparecen otros
 * valores (typos, variantes de mayúsculas, una cuarta línea), hay que
 * actualizar esta lista — ver el caso "Estrategia escrita de 9 maneras" en
 * Brain OS para la clase de problema que esto puede traer.
 */
