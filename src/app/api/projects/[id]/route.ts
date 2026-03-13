import { NextResponse, NextRequest } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/session";
import slugify from "slugify";
import { deleteImage } from "@/lib/upload";
import type { ProjectImage } from "@/types";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);

  const rows = isNaN(numId)
    ? await sql`
        SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
        FROM projects p LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.slug = ${id}
      `
    : await sql`
        SELECT p.*, c.name_el as category_name_el, c.name_en as category_name_en, c.slug as category_slug
        FROM projects p LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ${numId} OR p.slug = ${id}
      `;

  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const project = rows[0];
  const images = await sql`
    SELECT * FROM project_images WHERE project_id = ${project.id} ORDER BY sort_order
  `;

  return NextResponse.json({ ...project, images });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = Number(id);
  try {
    const body = await request.json();
    const {
      title_el, title_en, description_el, description_en,
      category_id, location, area, year, featured, status,
    } = body;

    let slug: string | undefined;
    if (title_en) {
      slug = slugify(title_en, { lower: true, strict: true });
      const existing = await sql`SELECT id FROM projects WHERE slug = ${slug} AND id != ${numId}`;
      if (existing.length > 0) {
        let counter = 1;
        while (true) {
          const check = await sql`SELECT id FROM projects WHERE slug = ${`${slug}-${counter}`} AND id != ${numId}`;
          if (check.length === 0) break;
          counter++;
        }
        slug = `${slug}-${counter}`;
      }
    }

    const rows = await sql`
      UPDATE projects SET
        title_el = COALESCE(${title_el ?? null}, title_el),
        title_en = COALESCE(${title_en ?? null}, title_en),
        description_el = COALESCE(${description_el ?? null}, description_el),
        description_en = COALESCE(${description_en ?? null}, description_en),
        slug = COALESCE(${slug ?? null}, slug),
        category_id = COALESCE(${category_id ?? null}, category_id),
        location = COALESCE(${location ?? null}, location),
        area = COALESCE(${area ?? null}, area),
        year = COALESCE(${year ?? null}, year),
        featured = COALESCE(${featured ?? null}, featured),
        status = COALESCE(${status ?? null}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${numId}
      RETURNING *
    `;

    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = Number(id);

  // Delete associated images from Vercel Blob
  const images = await sql`SELECT * FROM project_images WHERE project_id = ${numId}` as ProjectImage[];
  for (const img of images) {
    await deleteImage(img.url, img.thumb_url);
  }

  await sql`DELETE FROM projects WHERE id = ${numId}`;
  return NextResponse.json({ ok: true });
}
