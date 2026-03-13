import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log("Creating tables...");

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name_el TEXT NOT NULL,
      name_en TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title_el TEXT NOT NULL,
      title_en TEXT NOT NULL,
      description_el TEXT DEFAULT '',
      description_en TEXT DEFAULT '',
      slug TEXT UNIQUE NOT NULL,
      category_id INTEGER NOT NULL REFERENCES categories(id),
      location TEXT DEFAULT '',
      area TEXT DEFAULT '',
      year TEXT DEFAULT '',
      featured BOOLEAN DEFAULT false,
      status TEXT DEFAULT 'draft',
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS project_images (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      thumb_url TEXT NOT NULL,
      alt_text TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      is_cover BOOLEAN DEFAULT false
    )
  `;

  console.log("Migration complete!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
