import sql from "@/lib/db";
import Link from "next/link";
import type { ProjectWithCategory, ProjectImage } from "@/types";
import ProjectsTable from "@/components/admin/ProjectsTable";

export default async function AdminProjectsPage() {
  const projects = await sql`
    SELECT p.*, c.name_en as category_name_en, c.name_el as category_name_el, c.slug as category_slug
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  ` as ProjectWithCategory[];

  const projectsWithCovers = await Promise.all(
    projects.map(async (project) => {
      const covers = await sql`
        SELECT * FROM project_images WHERE project_id = ${project.id} AND is_cover = true LIMIT 1
      `;
      let coverImage = covers[0] as ProjectImage | undefined;
      if (!coverImage) {
        const firsts = await sql`
          SELECT * FROM project_images WHERE project_id = ${project.id} ORDER BY sort_order LIMIT 1
        `;
        coverImage = firsts[0] as ProjectImage | undefined;
      }
      return { ...project, cover_image: coverImage || null };
    })
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-800">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="px-5 py-2.5 bg-brand-800 text-white text-sm rounded-[2px] hover:bg-brand-700 transition-colors"
        >
          + New Project
        </Link>
      </div>

      <ProjectsTable projects={projectsWithCovers} />
    </div>
  );
}
