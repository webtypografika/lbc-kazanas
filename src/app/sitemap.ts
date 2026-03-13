import { MetadataRoute } from "next";
import sql from "@/lib/db";
import type { Project } from "@/types";

export const dynamic = "force-dynamic";

const BASE_URL = "https://lbc-constructions.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await sql`
    SELECT slug, updated_at FROM projects WHERE status = 'published'
  ` as Pick<Project, "slug" | "updated_at">[];

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.6 },
    { url: `${BASE_URL}/en`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/en/projects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/en/contact`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.5 },
  ];

  const projectPages = projects.flatMap((project) => [
    {
      url: `${BASE_URL}/projects/${project.slug}`,
      lastModified: new Date(project.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/en/projects/${project.slug}`,
      lastModified: new Date(project.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]);

  return [...staticPages, ...projectPages];
}
