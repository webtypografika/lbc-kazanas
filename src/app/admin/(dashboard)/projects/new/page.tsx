import sql from "@/lib/db";
import type { Category } from "@/types";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const categories = await sql`SELECT * FROM categories ORDER BY name_en` as Category[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-8">New Project</h1>
      <ProjectForm categories={categories} />
    </div>
  );
}
