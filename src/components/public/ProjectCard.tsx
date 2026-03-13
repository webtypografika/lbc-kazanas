"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

interface ProjectCardProps {
  project: {
    slug: string;
    title_el: string;
    title_en: string;
    category_name_el?: string;
    category_name_en?: string;
    location?: string;
    cover_image?: { url: string; thumb_url: string } | null;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const locale = useLocale();
  const title = locale === "el" ? project.title_el : project.title_en;
  const categoryName = locale === "el" ? project.category_name_el : project.category_name_en;

  return (
    <Link href={`/projects/${project.slug}`} style={{ display: "block", textDecoration: "none" }} className="group">
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "2px",
          aspectRatio: "4/3",
          backgroundColor: "#f5f5f5",
        }}
      >
        {project.cover_image ? (
          <Image
            src={project.cover_image.thumb_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              background: "linear-gradient(135deg, #e6f0f3 0%, #f5f5f5 100%)",
            }}
          >
            <svg style={{ width: "40px", height: "40px", color: "#96c3cf" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        {categoryName && (
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#c9962e", fontWeight: 500 }}>
            {categoryName}
          </span>
        )}
        <h3
          className="group-hover:!text-[#1f6d82]"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#0a2e3c",
            transition: "color 0.3s",
            marginTop: "6px",
          }}
        >
          {title}
        </h3>
        {project.location && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", fontSize: "12px", color: "#a3a3a3" }}>
            <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {project.location}
          </div>
        )}
      </div>
    </Link>
  );
}
