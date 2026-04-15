"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

interface ContentRow {
  id: number;
  section: string;
  key: string;
  value_el: string;
  value_en: string;
}

const SECTION_CONFIG: Record<string, { label: string; order: number }> = {
  hero: { label: "Hero", order: 0 },
  about: { label: "About Us", order: 1 },
  services: { label: "Services", order: 2 },
  cta: { label: "CTA", order: 3 },
  footer: { label: "Footer", order: 4 },
  contact_info: { label: "Contact Info", order: 5 },
  contact: { label: "Contact Page", order: 6 },
  map: { label: "Map", order: 7 },
};

const TEXTAREA_KEYS = ["description", "subtitle", "constructionDesc", "renovationDesc", "interiorDesc", "consultingDesc"];

function isTextarea(key: string) {
  return TEXTAREA_KEYS.includes(key);
}

function keyLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

export default function SiteContentManager({ content }: { content: ContentRow[] }) {
  const router = useRouter();
  const [data, setData] = useState<ContentRow[]>(content);
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sections = Object.entries(
    data.reduce<Record<string, ContentRow[]>>((acc, row) => {
      if (!acc[row.section]) acc[row.section] = [];
      acc[row.section].push(row);
      return acc;
    }, {})
  ).sort(([a], [b]) => (SECTION_CONFIG[a]?.order ?? 99) - (SECTION_CONFIG[b]?.order ?? 99));

  const [activeTab, setActiveTab] = useState(sections[0]?.[0] || "hero");

  const handleChange = (section: string, key: string, field: "value_el" | "value_en", value: string) => {
    setData((prev) =>
      prev.map((row) =>
        row.section === section && row.key === key ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSave = async (section: string) => {
    setSaving(section);
    setSuccess(null);

    const items = data
      .filter((row) => row.section === section)
      .map((row) => ({
        section: row.section,
        key: row.key,
        value_el: row.value_el,
        value_en: row.value_en,
      }));

    const res = await fetch("/api/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    if (res.ok) {
      setSuccess(section);
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    }

    setSaving(null);
  };

  const activeRows = data.filter((row) => row.section === activeTab);
  const isMapSection = activeTab === "map";

  return (
    <div className="max-w-5xl">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {sections.map(([section]) => (
          <button
            key={section}
            onClick={() => setActiveTab(section)}
            className={`px-4 py-2 text-sm rounded-[2px] transition-colors ${
              activeTab === section
                ? "bg-brand-800 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {SECTION_CONFIG[section]?.label || section}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white border border-neutral-200 rounded-[2px] p-8 space-y-6">
        <h2 className="text-lg font-semibold text-neutral-800">
          {SECTION_CONFIG[activeTab]?.label || activeTab}
        </h2>

        {isMapSection ? (
          <div className="space-y-6">
            {activeRows.map((row) => {
              if (row.key === "enabled") {
                return (
                  <label key={row.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={row.value_el === "true"}
                      onChange={(e) => {
                        const val = e.target.checked ? "true" : "false";
                        handleChange("map", "enabled", "value_el", val);
                        handleChange("map", "enabled", "value_en", val);
                      }}
                      className="w-4 h-4 rounded-[2px] border-neutral-300 text-brand-800 focus:ring-brand-600"
                    />
                    <span className="text-sm text-neutral-700">Show map on contact page</span>
                  </label>
                );
              }
              if (row.key === "embed_url") {
                return (
                  <div key={row.key}>
                    <Input
                      label="Google Maps Embed URL"
                      value={row.value_el}
                      onChange={(e) => {
                        handleChange("map", "embed_url", "value_el", e.target.value);
                        handleChange("map", "embed_url", "value_en", e.target.value);
                      }}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                    <p className="text-xs text-neutral-400 mt-2">
                      Go to Google Maps → Share → Embed → Copy the src URL from the iframe code
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ) : (
          <div className="space-y-6">
            {activeRows.map((row) => {
              const InputComponent = isTextarea(row.key) ? Textarea : Input;
              return (
                <div key={row.key}>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                    {keyLabel(row.key)}
                  </p>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <InputComponent
                      label="Ελληνικά"
                      value={row.value_el}
                      onChange={(e) => handleChange(row.section, row.key, "value_el", e.target.value)}
                    />
                    <InputComponent
                      label="English"
                      value={row.value_en}
                      onChange={(e) => handleChange(row.section, row.key, "value_en", e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-neutral-100">
          <Button onClick={() => handleSave(activeTab)} disabled={saving === activeTab}>
            {saving === activeTab ? "Saving..." : "Save Changes"}
          </Button>
          {success === activeTab && (
            <span className="text-sm text-green-600">Saved successfully!</span>
          )}
        </div>
      </div>
    </div>
  );
}
