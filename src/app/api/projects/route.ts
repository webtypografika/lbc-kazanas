import { NextResponse, NextRequest } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/session";
import slugify from "slugify";
import type { ProjectImage } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");

  let projects;

  if (category && status && search) {
    projects = await sql`
      SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
      FROM projects p LEFT JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ${category} AND p.status = ${status}
        AND (p.title_el ILIKE ${'%' + search + '%'} OR p.title_en ILIKE ${'%' + search + '%'})
      ORDER BY p.created_at DESC
    `;
  } else if (category && status) {
    projects = await sql`
      SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
      FROM projects p LEFT JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ${category} AND p.status = ${status}
      ORDER BY p.created_at DESC
    `;
  } else if (category && search) {
    projects = await sql`
      SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
      FROM projects p LEFT JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ${category}
        AND (p.title_el ILIKE ${'%' + search + '%'} OR p.title_en ILIKE ${'%' + search + '%'})
      ORDER BY p.created_at DESC
    `;
  } else if (status && search) {
    projects = await sql`
      SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
      FROM projects p LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = ${status}
        AND (p.title_el ILIKE ${'%' + search + '%'} OR p.title_en ILIKE ${'%' + search + '%'})
      ORDER BY p.created_at DESC
    `;
  } else if (category) {
    projects = await sql`
      SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
      FROM projects p LEFT JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ${category}
      ORDER BY p.created_at DESC
    `;
  } else if (status) {
    projects = await sql`
      SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
      FROM projects p LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = ${status}
      ORDER BY p.created_at DESC
    `;
  } else if (featured === "1") {
    projects = await sql`
      SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
      FROM projects p LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.featured = true
      ORDER BY p.created_at DESC
    `;
  } else if (search) {
    projects = await sql`
      SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
      FROM projects p LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.title_el ILIKE ${'%' + search + '%'} OR p.title_en ILIKE ${'%' + search + '%'}
      ORDER BY p.created_at DESC
    `;
  } else {
    projects = await sql`
      SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
      FROM projects p LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
  }

  // Attach cover images
  const projectsWithCovers = await Promise.all(
    projects.map(async (project) => {
      const covers = await sql`
        SELECT * FROM project_images WHERE project_id = ${project.id} AND is_cover = true LIMIT 1
      `;
      let coverImage: ProjectImage | null = covers[0] as ProjectImage | null ?? null;
      if (!coverImage) {
        const firsts = await sql`
          SELECT * FROM project_images WHERE project_id = ${project.id} ORDER BY sort_order LIMIT 1
        `;
        coverImage = firsts[0] as ProjectImage | null ?? null;
      }
      return { ...project, cover_image: coverImage };
    })
  );

  return NextResponse.json(projectsWithCovers);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const {
      title_el, title_en, description_el = "", description_en = "",
      category_id, location = "", area = "", year = "",
      featured = false, status = "draft",
    } = body;

    if (!title_el || !title_en || !category_id) {
      return NextResponse.json({ error: "Title and category required" }, { status: 400 });
    }

    const slug = slugify(title_en, { lower: true, strict: true });

    // Ensure unique slug
    let finalSlug = slug;
    let counter = 1;
    while (true) {
      const existing = await sql`SELECT id FROM projects WHERE slug = ${finalSlug}`;
      if (existing.length === 0) break;
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const rows = await sql`
      INSERT INTO projects (title_el, title_en, description_el, description_en, slug, category_id, location, area, year, featured, status)
      VALUES (${title_el}, ${title_en}, ${description_el}, ${description_en}, ${finalSlug}, ${category_id}, ${location}, ${area}, ${year}, ${featured}, ${status})
      RETURNING *
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
