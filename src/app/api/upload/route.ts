import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { processImage } from "@/lib/upload";
import sql from "@/lib/db";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const projectId = formData.get("project_id") as string;
    const files = formData.getAll("files") as File[];

    if (!projectId || files.length === 0) {
      return NextResponse.json({ error: "Project ID and files required" }, { status: 400 });
    }

    const numProjectId = Number(projectId);
    const maxOrderRows = await sql`
      SELECT MAX(sort_order) as max_order FROM project_images WHERE project_id = ${numProjectId}
    `;

    let sortOrder = (maxOrderRows[0]?.max_order ?? -1) + 1;
    const uploaded = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const { url, thumbUrl } = await processImage(file);
      const isFirst = sortOrder === 0;

      const rows = await sql`
        INSERT INTO project_images (project_id, url, thumb_url, alt_text, sort_order, is_cover)
        VALUES (${numProjectId}, ${url}, ${thumbUrl}, '', ${sortOrder}, ${isFirst})
        RETURNING *
      `;

      uploaded.push(rows[0]);
      sortOrder++;
    }

    return NextResponse.json(uploaded, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
