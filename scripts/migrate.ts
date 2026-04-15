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

  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      id SERIAL PRIMARY KEY,
      section TEXT NOT NULL,
      key TEXT NOT NULL,
      value_el TEXT NOT NULL DEFAULT '',
      value_en TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(section, key)
    )
  `;

  // Seed default site content
  const defaults = [
    // Hero
    { section: "hero", key: "title", el: "Πολυτελείς Κατασκευές & Ανακαινίσεις", en: "Luxury Building Constructions & Renovations" },
    { section: "hero", key: "subtitle", el: "Δημιουργούμε χώρους που εμπνέουν. Από τον σχεδιασμό μέχρι την υλοποίηση, κάθε λεπτομέρεια μετράει.", en: "We create spaces that inspire. From design to execution, every detail matters." },
    { section: "hero", key: "cta", el: "Δείτε τα Έργα μας", en: "View Our Projects" },
    // About
    { section: "about", key: "title", el: "Ποιοι Είμαστε", en: "About Us" },
    { section: "about", key: "description", el: "Η LBC (Luxury Building Constructions) ειδικεύεται στις πολυτελείς κατασκευές και ανακαινίσεις. Με πάθος για την αριστεία και προσοχή στη λεπτομέρεια, μετατρέπουμε κάθε χώρο σε ένα αριστούργημα.", en: "LBC (Luxury Building Constructions) specializes in luxury constructions and renovations. With a passion for excellence and attention to detail, we transform every space into a masterpiece." },
    { section: "about", key: "stat_experience", el: "15+", en: "15+" },
    { section: "about", key: "stat_experience_label", el: "Χρόνια Εμπειρίας", en: "Years of Experience" },
    { section: "about", key: "stat_projects", el: "200+", en: "200+" },
    { section: "about", key: "stat_projects_label", el: "Ολοκληρωμένα Έργα", en: "Completed Projects" },
    { section: "about", key: "stat_satisfaction", el: "100%", en: "100%" },
    { section: "about", key: "stat_satisfaction_label", el: "Ικανοποίηση Πελατών", en: "Client Satisfaction" },
    // Services
    { section: "services", key: "title", el: "Οι Υπηρεσίες μας", en: "Our Services" },
    { section: "services", key: "construction", el: "Κατασκευές", en: "Construction" },
    { section: "services", key: "constructionDesc", el: "Πολυτελείς κατοικίες και εμπορικά κτίρια υψηλών προδιαγραφών.", en: "Luxury residences and high-specification commercial buildings." },
    { section: "services", key: "renovation", el: "Ανακαινίσεις", en: "Renovations" },
    { section: "services", key: "renovationDesc", el: "Πλήρης ανακαίνιση χώρων με σύγχρονο σχεδιασμό και ποιοτικά υλικά.", en: "Complete space renovations with modern design and quality materials." },
    { section: "services", key: "interior", el: "Εσωτερική Διακόσμηση", en: "Interior Design" },
    { section: "services", key: "interiorDesc", el: "Σχεδιασμός εσωτερικών χώρων που συνδυάζουν αισθητική και λειτουργικότητα.", en: "Interior design that combines aesthetics and functionality." },
    { section: "services", key: "consulting", el: "Συμβουλευτική", en: "Consulting" },
    { section: "services", key: "consultingDesc", el: "Επαγγελματική καθοδήγηση σε κάθε στάδιο του έργου σας.", en: "Professional guidance at every stage of your project." },
    // CTA
    { section: "cta", key: "title", el: "Έτοιμοι να ξεκινήσουμε;", en: "Ready to start?" },
    { section: "cta", key: "subtitle", el: "Επικοινωνήστε μαζί μας για να συζητήσουμε το επόμενο έργο σας.", en: "Contact us to discuss your next project." },
    { section: "cta", key: "button", el: "Επικοινωνία", en: "Contact Us" },
    // Footer
    { section: "footer", key: "description", el: "Πολυτελείς κατασκευές και ανακαινίσεις υψηλών προδιαγραφών.", en: "Luxury building constructions and high-specification renovations." },
    // Contact info (shared between footer and contact page)
    { section: "contact_info", key: "address", el: "Λευκωσία, Κύπρος", en: "Nicosia, Cyprus" },
    { section: "contact_info", key: "phone", el: "+357 99 123 456", en: "+357 99 123 456" },
    { section: "contact_info", key: "email", el: "info@lbc-constructions.com", en: "info@lbc-constructions.com" },
    // Contact page
    { section: "contact", key: "title", el: "Επικοινωνία", en: "Contact" },
    { section: "contact", key: "subtitle", el: "Θα χαρούμε να ακούσουμε για το έργο σας.", en: "We'd love to hear about your project." },
    // Map
    { section: "map", key: "enabled", el: "false", en: "false" },
    { section: "map", key: "embed_url", el: "", en: "" },
  ];

  for (const d of defaults) {
    await sql`
      INSERT INTO site_content (section, key, value_el, value_en)
      VALUES (${d.section}, ${d.key}, ${d.el}, ${d.en})
      ON CONFLICT (section, key) DO NOTHING
    `;
  }
  console.log("Site content seeded");

  console.log("Migration complete!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
