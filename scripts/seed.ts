import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  // Seed admin user
  const passwordHash = bcrypt.hashSync("admin123", 12);
  const existingUser = await sql`SELECT id FROM users WHERE username = 'admin'`;
  if (existingUser.length === 0) {
    await sql`INSERT INTO users (username, password_hash) VALUES ('admin', ${passwordHash})`;
    console.log("Admin user created (username: admin, password: admin123)");
  } else {
    console.log("Admin user already exists");
  }

  // Seed categories
  const categories = [
    { name_el: "Κατοικίες", name_en: "Residences", slug: "residences" },
    { name_el: "Εμπορικά", name_en: "Commercial", slug: "commercial" },
    { name_el: "Ανακαινίσεις", name_en: "Renovations", slug: "renovations" },
    { name_el: "Εσωτερική Διακόσμηση", name_en: "Interior Design", slug: "interior-design" },
  ];

  for (const cat of categories) {
    await sql`
      INSERT INTO categories (name_el, name_en, slug)
      VALUES (${cat.name_el}, ${cat.name_en}, ${cat.slug})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log("Categories seeded");

  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
