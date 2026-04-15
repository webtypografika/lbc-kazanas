"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { Category } from "@/types";

type CategoryWithCount = Category & { projectCount: number };

export default function CategoriesManager({ categories }: { categories: CategoryWithCount[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name_el: "", name_en: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const resetForm = () => {
    setForm({ name_el: "", name_en: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name_el || !form.name_en) return;

    const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      resetForm();
      router.refresh();
    }
  };

  const handleEdit = (cat: CategoryWithCount) => {
    setEditingId(cat.id);
    setForm({ name_el: cat.name_el, name_en: cat.name_en });
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteId(null);
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Cannot delete");
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Add/Edit form */}
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-[2px] p-8 space-y-5">
        <h2 className="text-sm font-medium text-neutral-800">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <Input
            placeholder="Name (Greek)"
            value={form.name_el}
            onChange={(e) => setForm((prev) => ({ ...prev, name_el: e.target.value }))}
            required
          />
          <Input
            placeholder="Name (English)"
            value={form.name_en}
            onChange={(e) => setForm((prev) => ({ ...prev, name_en: e.target.value }))}
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">
            {editingId ? "Update" : "Add Category"}
          </Button>
          {editingId && (
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Categories list */}
      <div className="bg-white border border-neutral-200 rounded-[2px] overflow-hidden">
        {categories.length === 0 ? (
          <div className="px-6 py-8 text-center text-neutral-400 text-sm">
            No categories yet.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Name (EN)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Name (EL)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Projects</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-3 text-sm text-neutral-800">{cat.name_en}</td>
                  <td className="px-6 py-3 text-sm text-neutral-600">{cat.name_el}</td>
                  <td className="px-6 py-3 text-sm text-neutral-500">{cat.projectCount}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="text-xs px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-[2px] hover:bg-neutral-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(cat.id)}
                        className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-[2px] hover:bg-red-100"
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

      {/* Delete confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-[2px] max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">Delete Category</h3>
            <p className="text-sm text-neutral-600 mb-6">
              Categories with projects cannot be deleted. Remove or reassign the projects first.
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
    </div>
  );
}
