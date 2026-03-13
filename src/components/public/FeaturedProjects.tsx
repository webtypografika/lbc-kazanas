import sql from "@/lib/db";
import type { ProjectWithCategory, ProjectImage } from "@/types";
import ProjectCard from "./ProjectCard";

export default async function FeaturedProjects() {
  const projects = await sql`
    SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.featured = true AND p.status = 'published'
    ORDER BY p.created_at DESC
    LIMIT 4
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

  if (projectsWithCovers.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#a3a3a3" }}>
          Coming Soon
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "2rem" }}>
      {projectsWithCovers.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
