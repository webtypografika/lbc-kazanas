import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import sql from "@/lib/db";
import type { ProjectWithCategory, ProjectImage } from "@/types";
import ImageGallery from "@/components/public/ImageGallery";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const rows = await sql`
    SELECT p.* FROM projects p WHERE p.slug = ${slug} AND p.status = 'published'
  `;
  const project = rows[0] as ProjectWithCategory | undefined;
  if (!project) return { title: "Not Found" };
  const title = locale === "el" ? project.title_el : project.title_en;
  const description = locale === "el" ? project.description_el : project.description_en;
  return { title, description: description?.slice(0, 160) };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("projects");

  const rows = await sql`
    SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
    FROM projects p LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ${slug} AND p.status = 'published'
  `;
  const project = rows[0] as ProjectWithCategory | undefined;

  if (!project) notFound();

  const images = await sql`
    SELECT * FROM project_images WHERE project_id = ${project.id} ORDER BY sort_order
  ` as ProjectImage[];

  const title = locale === "el" ? project.title_el : project.title_en;
  const description = locale === "el" ? project.description_el : project.description_en;
  const categoryName = locale === "el" ? project.category_name_el : project.category_name_en;

  return (
    <>
      {/* Header */}
      <section style={{ paddingTop: "8rem", paddingBottom: "3rem", backgroundColor: "#fafafa" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#a3a3a3", marginBottom: "2rem" }}>
            <Link href="/" style={{ transition: "color 0.3s" }} className="hover:!text-brand-800">
              {locale === "el" ? "Αρχική" : "Home"}
            </Link>
            <span style={{ color: "#d4d4d4" }}>/</span>
            <Link href="/projects" style={{ transition: "color 0.3s" }} className="hover:!text-brand-800">
              {t("title")}
            </Link>
            <span style={{ color: "#d4d4d4" }}>/</span>
            <span style={{ color: "#525252" }}>{title}</span>
          </nav>

          {categoryName && (
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.3em", color: "#c9962e", fontWeight: 500 }}>
              {categoryName}
            </span>
          )}
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "#0a2e3c", marginTop: "8px" }}>
            {title}
          </h1>
        </div>
      </section>

      <section style={{ padding: "3rem 0 5rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div className="grid lg:grid-cols-3" style={{ gap: "3rem" }}>
            {/* Gallery */}
            <div className="lg:col-span-2">
              <ImageGallery images={images} title={title} />
            </div>

            {/* Sidebar */}
            <div>
              {description && (
                <div style={{ marginBottom: "2rem" }}>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", fontWeight: 600, color: "#0a2e3c", marginBottom: "1rem" }}>
                    {locale === "el" ? "Περιγραφή" : "Description"}
                  </h2>
                  <p style={{ color: "#737373", fontSize: "0.875rem", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                    {description}
                  </p>
                </div>
              )}

              {/* Details card */}
              <div style={{ backgroundColor: "#fafafa", borderRadius: "2px", padding: "1.5rem" }}>
                <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#a3a3a3", fontWeight: 500, marginBottom: "1.25rem" }}>
                  {locale === "el" ? "Στοιχεία Έργου" : "Project Details"}
                </h3>
                {[
                  { label: t("category"), value: categoryName },
                  { label: t("location"), value: project.location },
                  { label: t("area"), value: project.area },
                  { label: t("year"), value: project.year },
                ]
                  .filter((item) => item.value)
                  .map((item, i, arr) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "14px 0",
                        borderBottom: i < arr.length - 1 ? "1px solid #e5e5e5" : "none",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#a3a3a3", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: "0.875rem", color: "#262626", fontWeight: 500 }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Back link */}
              <Link
                href="/projects"
                className="group"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "#0a2e3c",
                  marginTop: "2rem",
                }}
              >
                <svg
                  className="group-hover:-translate-x-1 transition-transform"
                  style={{ width: "16px", height: "16px" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                {locale === "el" ? "Πίσω στα Έργα" : "Back to Projects"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
