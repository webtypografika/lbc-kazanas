"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import ImageUploader from "./ImageUploader";
import type { Category, Project, ProjectImage } from "@/types";

interface ProjectFormProps {
  categories: Category[];
  project?: Project;
  existingImages?: ProjectImage[];
}

export default function ProjectForm({ categories, project, existingImages = [] }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!project;

  const [form, setForm] = useState({
    title_el: project?.title_el || "",
    title_en: project?.title_en || "",
    description_el: project?.description_el || "",
    description_en: project?.description_en || "",
    category_id: project?.category_id?.toString() || "",
    location: project?.location || "",
    area: project?.area || "",
    year: project?.year || "",
    featured: !!project?.featured,
    status: project?.status || "draft",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isEdit ? `/api/projects/${project.id}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          category_id: Number(form.category_id),
          featured: form.featured ? 1 : 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      const data = await res.json();

      if (!isEdit) {
        router.push(`/admin/projects/${data.id}/edit`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      {/* Basic Info */}
      <div className="bg-white border border-neutral-200 rounded-[2px] p-6 space-y-5">
        <h2 className="text-lg font-semibold text-neutral-800">Project Details</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <Input
            label="Title (Greek)"
            name="title_el"
            value={form.title_el}
            onChange={handleChange}
            required
            placeholder="Τίτλος έργου"
          />
          <Input
            label="Title (English)"
            name="title_en"
            value={form.title_en}
            onChange={handleChange}
            required
            placeholder="Project title"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Textarea
            label="Description (Greek)"
            name="description_el"
            value={form.description_el}
            onChange={handleChange}
            placeholder="Περιγραφή έργου..."
            rows={5}
          />
          <Textarea
            label="Description (English)"
            name="description_en"
            value={form.description_en}
            onChange={handleChange}
            placeholder="Project description..."
            rows={5}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="bg-white border border-neutral-200 rounded-[2px] p-6 space-y-5">
        <h2 className="text-lg font-semibold text-neutral-800">Details</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">Category</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-[2px] text-sm text-neutral-800 focus:outline-none focus:border-brand-600"
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name_en} / {cat.name_el}</option>
              ))}
            </select>
          </div>
          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Nicosia, Cyprus"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <Input
            label="Area"
            name="area"
            value={form.area}
            onChange={handleChange}
            placeholder="e.g. 250 m²"
          />
          <Input
            label="Year"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="e.g. 2024"
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-[2px] text-sm text-neutral-800 focus:outline-none focus:border-brand-600"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="w-4 h-4 rounded-[2px] border-neutral-300 text-brand-800 focus:ring-brand-600"
          />
          <span className="text-sm text-neutral-700">Featured project (show on homepage)</span>
        </label>
      </div>

      {/* Images (only for existing projects) */}
      {isEdit && (
        <div className="bg-white border border-neutral-200 rounded-[2px] p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Images</h2>
          <ImageUploader projectId={project.id} images={existingImages} />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-[2px] text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
      </div>

      {!isEdit && (
        <p className="text-xs text-neutral-400">
          You can add images after creating the project.
        </p>
      )}
    </form>
  );
}
