import { NextResponse, NextRequest } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/session";
import slugify from "slugify";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await sql`SELECT * FROM categories WHERE id = ${Number(id)}`;
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { name_el, name_en } = await request.json();
    const slug = slugify(name_en, { lower: true, strict: true });
    const rows = await sql`
      UPDATE categories SET name_el = ${name_el}, name_en = ${name_en}, slug = ${slug}
      WHERE id = ${Number(id)}
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

  const projects = await sql`SELECT COUNT(*) as count FROM projects WHERE category_id = ${numId}`;
  if (Number(projects[0].count) > 0) {
    return NextResponse.json({ error: "Category has projects, cannot delete" }, { status: 400 });
  }

  await sql`DELETE FROM categories WHERE id = ${numId}`;
  return NextResponse.json({ ok: true });
}
