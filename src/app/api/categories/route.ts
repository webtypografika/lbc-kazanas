import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/session";
import slugify from "slugify";

export async function GET() {
  const categories = await sql`SELECT * FROM categories ORDER BY name_en`;
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name_el, name_en } = await request.json();
    if (!name_el || !name_en) {
      return NextResponse.json({ error: "Both names required" }, { status: 400 });
    }

    const slug = slugify(name_en, { lower: true, strict: true });
    const rows = await sql`
      INSERT INTO categories (name_el, name_en, slug)
      VALUES (${name_el}, ${name_en}, ${slug})
      RETURNING *
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
