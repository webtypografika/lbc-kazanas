import sql from "@/lib/db";

export type SiteContent = Record<string, string>;

export async function getSiteContent(section: string, locale: string): Promise<SiteContent> {
  const rows = await sql`SELECT key, value_el, value_en FROM site_content WHERE section = ${section}`;
  const result: SiteContent = {};
  for (const row of rows) {
    result[row.key] = locale === "el" ? row.value_el : row.value_en;
  }
  return result;
}
