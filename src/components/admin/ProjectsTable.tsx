"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProjectWithCategory, ProjectImage } from "@/types";

type ProjectWithCover = ProjectWithCategory & { cover_image: ProjectImage | null };

export default function ProjectsTable({ projects }: { projects: ProjectWithCover[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) =>
    p.title_en.toLowerCase().includes(search.toLowerCase()) ||
    p.title_el.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteId(null);
      router.refresh();
    }
  };

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-neutral-200 rounded-[2px] text-sm focus:outline-none focus:border-brand-600"
        />
      </div>

      <div className="bg-white border border-neutral-200 rounded-[2px] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-neutral-400 text-sm">
            No projects found.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((project) => (
                <tr key={project.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-neutral-100 rounded-[2px] overflow-hidden flex-shrink-0 relative">
                        {project.cover_image ? (
                          <Image
                            src={project.cover_image.thumb_url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-800">{project.title_en}</div>
                        <div className="text-xs text-neutral-400">{project.title_el}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{project.category_name_en}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-[2px] ${
                      project.status === "published" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {project.status}
                    </span>
                    {project.featured && (
                      <span className="ml-2 text-xs px-2 py-1 rounded-[2px] bg-gold-50 text-gold-700">
                        featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="text-xs px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-[2px] hover:bg-neutral-200 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(project.id)}
                        className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-[2px] hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-[2px] max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">Delete Project</h3>
            <p className="text-sm text-neutral-600 mb-6">
              Are you sure? This will also delete all associated images. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-[2px] hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
