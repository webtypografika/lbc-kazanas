import { notFound } from "next/navigation";
import sql from "@/lib/db";
import type { Category, Project, ProjectImage } from "@/types";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);

  const projectRows = await sql`SELECT * FROM projects WHERE id = ${numId}`;
  const project = projectRows[0] as Project | undefined;
  if (!project) notFound();

  const categories = await sql`SELECT * FROM categories ORDER BY name_en` as Category[];
  const images = await sql`
    SELECT * FROM project_images WHERE project_id = ${numId} ORDER BY sort_order
  ` as ProjectImage[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-8">Edit Project</h1>
      <ProjectForm categories={categories} project={project} existingImages={images} />
    </div>
  );
}
