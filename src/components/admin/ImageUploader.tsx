"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ProjectImage } from "@/types";

export default function ImageUploader({
  projectId,
  images: initialImages,
}: {
  projectId: number;
  images: ProjectImage[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("project_id", projectId.toString());
    for (const file of imageFiles) {
      formData.append("files", file);
    }

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const uploaded = await res.json();
        setImages((prev) => [...prev, ...uploaded]);
        router.refresh();
      }
    } catch {
      // Silently fail
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: number) => {
    const res = await fetch(`/api/images/${imageId}`, { method: "DELETE" });
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      router.refresh();
    }
  };

  const handleSetCover = async (imageId: number) => {
    const res = await fetch(`/api/images/${imageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_cover: true }),
    });
    if (res.ok) {
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          is_cover: img.id === imageId,
        }))
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-[2px] p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-brand-600 bg-brand-50"
            : "border-neutral-300 hover:border-neutral-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <p className="text-sm text-neutral-500">Uploading...</p>
        ) : (
          <>
            <svg className="w-8 h-8 mx-auto text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-neutral-500">
              Drag & drop images here, or click to browse
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Supports JPG, PNG, WebP
            </p>
          </>
        )}
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <div className="relative aspect-square bg-neutral-100 rounded-[2px] overflow-hidden">
                <Image
                  src={img.thumb_url}
                  alt={img.alt_text || ""}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                {img.is_cover && (
                  <div className="absolute top-1 left-1 bg-brand-800 text-white text-[10px] px-1.5 py-0.5 rounded-[2px]">
                    Cover
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity flex">
                <button
                  type="button"
                  onClick={() => handleSetCover(img.id)}
                  className="flex-1 text-[10px] py-1.5 hover:bg-white/10 transition-colors"
                  title="Set as cover"
                >
                  Cover
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  className="flex-1 text-[10px] py-1.5 text-red-300 hover:bg-white/10 transition-colors"
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
