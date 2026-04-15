import sql from "@/lib/db";
import SiteContentManager from "@/components/admin/SiteContentManager";

interface ContentRow {
  id: number;
  section: string;
  key: string;
  value_el: string;
  value_en: string;
}

export default async function AdminSiteContentPage() {
  const content = await sql`SELECT * FROM site_content ORDER BY section, key` as ContentRow[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-10">Site Content</h1>
      <SiteContentManager content={content} />
    </div>
  );
}
