import sql from "@/lib/db";
import Link from "next/link";
import type { Project } from "@/types";

export default async function AdminDashboardPage() {
  const totalRows = await sql`SELECT COUNT(*) as count FROM projects`;
  const publishedRows = await sql`SELECT COUNT(*) as count FROM projects WHERE status = 'published'`;
  const draftRows = await sql`SELECT COUNT(*) as count FROM projects WHERE status = 'draft'`;
  const categoryRows = await sql`SELECT COUNT(*) as count FROM categories`;

  const totalProjects = Number(totalRows[0].count);
  const publishedProjects = Number(publishedRows[0].count);
  const draftProjects = Number(draftRows[0].count);
  const totalCategories = Number(categoryRows[0].count);

  const recentProjects = await sql`
    SELECT * FROM projects ORDER BY created_at DESC LIMIT 5
  ` as Project[];

  const stats = [
    { label: "Total Projects", value: totalProjects, color: "bg-brand-50 text-brand-800" },
    { label: "Published", value: publishedProjects, color: "bg-green-50 text-green-800" },
    { label: "Drafts", value: draftProjects, color: "bg-yellow-50 text-yellow-800" },
    { label: "Categories", value: totalCategories, color: "bg-blue-50 text-blue-800" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
        <Link
          href="/admin/projects/new"
          className="px-5 py-2.5 bg-brand-800 text-white text-sm rounded-[2px] hover:bg-brand-700 transition-colors"
        >
          + New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.color} p-6 rounded-[2px]`}>
            <div className="text-3xl font-bold font-[family-name:var(--font-heading)]">{stat.value}</div>
            <div className="text-sm mt-1 opacity-75">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="bg-white border border-neutral-200 rounded-[2px]">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-800">Recent Projects</h2>
        </div>
        {recentProjects.length === 0 ? (
          <div className="px-6 py-8 text-center text-neutral-400 text-sm">
            No projects yet. Create your first project!
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {recentProjects.map((project) => (
              <div key={project.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-neutral-800">{project.title_en}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{project.title_el}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-[2px] ${
                    project.status === "published" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                  }`}>
                    {project.status}
                  </span>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="text-xs text-brand-800 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
