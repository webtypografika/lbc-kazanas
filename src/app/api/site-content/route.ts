import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  const rows = section
    ? await sql`SELECT * FROM site_content WHERE section = ${section} ORDER BY key`
    : await sql`SELECT * FROM site_content ORDER BY section, key`;

  return NextResponse.json(rows);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items } = await request.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Items array required" }, { status: 400 });
    }

    for (const item of items) {
      await sql`
        INSERT INTO site_content (section, key, value_el, value_en, updated_at)
        VALUES (${item.section}, ${item.key}, ${item.value_el}, ${item.value_en}, CURRENT_TIMESTAMP)
        ON CONFLICT (section, key) DO UPDATE SET
          value_el = ${item.value_el},
          value_en = ${item.value_en},
          updated_at = CURRENT_TIMESTAMP
      `;
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
