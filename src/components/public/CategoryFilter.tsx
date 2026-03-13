"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Category } from "@/types";

export default function CategoryFilter({
  categories,
  activeCategory,
}: {
  categories: Category[];
  activeCategory?: string;
}) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("projects");

  const handleClick = (slug?: string) => {
    if (slug) {
      router.push(`/projects?category=${slug}`);
    } else {
      router.push("/projects");
    }
  };

  const buttonBase: React.CSSProperties = {
    padding: "10px 24px",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    borderRadius: "2px",
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.3s",
  };

  const activeStyle: React.CSSProperties = {
    ...buttonBase,
    backgroundColor: "#0a2e3c",
    color: "#ffffff",
    borderColor: "#0a2e3c",
  };

  const inactiveStyle: React.CSSProperties = {
    ...buttonBase,
    backgroundColor: "#ffffff",
    color: "#737373",
    borderColor: "#e5e5e5",
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem" }}>
      <button
        onClick={() => handleClick()}
        style={!activeCategory ? activeStyle : inactiveStyle}
      >
        {t("all")}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.slug)}
          style={activeCategory === cat.slug ? activeStyle : inactiveStyle}
        >
          {locale === "el" ? cat.name_el : cat.name_en}
        </button>
      ))}
    </div>
  );
}
