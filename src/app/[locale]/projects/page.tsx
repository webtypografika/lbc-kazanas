import { useTranslations } from "next-intl";
import sql from "@/lib/db";
import type { Category, ProjectWithCategory, ProjectImage } from "@/types";
import CategoryFilter from "@/components/public/CategoryFilter";
import ProjectCard from "@/components/public/ProjectCard";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const categories = await sql`SELECT * FROM categories ORDER BY name_en` as Category[];

  let projects: ProjectWithCategory[];
  if (category) {
    projects = await sql`
      SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'published' AND c.slug = ${category}
      ORDER BY p.created_at DESC
    ` as ProjectWithCategory[];
  } else {
    projects = await sql`
      SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
    ` as ProjectWithCategory[];
  }

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
    <ProjectsContent
      categories={categories}
      projects={projectsWithCovers}
      activeCategory={category}
    />
  );
}

function ProjectsContent({
  categories,
  projects,
  activeCategory,
}: {
  categories: Category[];
  projects: (ProjectWithCategory & { cover_image: ProjectImage | null })[];
  activeCategory?: string;
}) {
  const t = useTranslations("projects");

  return (
    <>
      {/* Page header */}
      <section style={{ paddingTop: "8rem", paddingBottom: "4rem", backgroundColor: "#fafafa" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.3em", color: "#c9962e", fontWeight: 500 }}>
            Portfolio
          </span>
          <div style={{ width: "40px", height: "1px", backgroundColor: "#e5b13f", margin: "1rem auto 2rem" }} />
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "#0a2e3c", marginBottom: "1.25rem" }}>
            {t("title")}
          </h1>
          <p style={{ color: "#737373", maxWidth: "32rem", margin: "0 auto" }}>
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section style={{ padding: "4rem 0 5rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <CategoryFilter categories={categories} activeCategory={activeCategory} />

          {projects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "6rem 0" }}>
              <svg style={{ width: "64px", height: "64px", color: "#e5e5e5", margin: "0 auto 1rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p style={{ color: "#a3a3a3", fontSize: "0.875rem" }}>{t("noProjects")}</p>
            </div>
          ) : (
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-3"
              style={{ gap: "2rem", marginTop: "3.5rem" }}
            >
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
