import sql from "@/lib/db";
import type { Category } from "@/types";
import CategoriesManager from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await sql`SELECT * FROM categories ORDER BY name_en` as Category[];

  // Count projects per category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const result = await sql`SELECT COUNT(*) as count FROM projects WHERE category_id = ${cat.id}`;
      return { ...cat, projectCount: Number(result[0].count) };
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-8">Categories</h1>
      <CategoriesManager categories={categoriesWithCounts} />
    </div>
  );
}
