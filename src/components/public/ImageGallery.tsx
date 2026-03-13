"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProjectImage } from "@/types";

export default function ImageGallery({ images, title }: { images: ProjectImage[]; title: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/10] bg-neutral-100 rounded-[2px] flex items-center justify-center">
        <span className="text-neutral-400 text-sm">No images</span>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  return (
    <>
      {/* Main Image */}
      <div
        className="relative aspect-[16/10] bg-neutral-100 rounded-[2px] overflow-hidden cursor-pointer"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.alt_text || title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(i)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-[2px] overflow-hidden transition-opacity ${
                i === selectedIndex ? "ring-2 ring-brand-800 opacity-100" : "opacity-60 hover:opacity-80"
              }`}
            >
              <Image
                src={img.thumb_url}
                alt={img.alt_text || `${title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white z-50"
            onClick={() => setLightboxOpen(false)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 text-white/70 hover:text-white z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
                }}
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-4 text-white/70 hover:text-white z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => (prev + 1) % images.length);
                }}
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="relative w-[90vw] h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selectedIndex].url}
              alt={images[selectedIndex].alt_text || title}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          <div className="absolute bottom-6 text-white/50 text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
