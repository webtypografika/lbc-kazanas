import { NextResponse, NextRequest } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/session";
import { deleteImage } from "@/lib/upload";
import type { ProjectImage } from "@/types";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = Number(id);
  const body = await request.json();

  if (body.is_cover !== undefined) {
    const rows = await sql`SELECT * FROM project_images WHERE id = ${numId}`;
    const image = rows[0] as ProjectImage | undefined;
    if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Unset all covers for this project, then set this one
    await sql`UPDATE project_images SET is_cover = false WHERE project_id = ${image.project_id}`;
    await sql`UPDATE project_images SET is_cover = true WHERE id = ${numId}`;
  }

  if (body.alt_text !== undefined) {
    await sql`UPDATE project_images SET alt_text = ${body.alt_text} WHERE id = ${numId}`;
  }

  if (body.sort_order !== undefined) {
    await sql`UPDATE project_images SET sort_order = ${body.sort_order} WHERE id = ${numId}`;
  }

  const updated = await sql`SELECT * FROM project_images WHERE id = ${numId}`;
  return NextResponse.json(updated[0]);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = Number(id);

  const rows = await sql`SELECT * FROM project_images WHERE id = ${numId}`;
  const image = rows[0] as ProjectImage | undefined;
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteImage(image.url, image.thumb_url);
  await sql`DELETE FROM project_images WHERE id = ${numId}`;

  return NextResponse.json({ ok: true });
}
