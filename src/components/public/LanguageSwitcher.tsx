"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher({ isLight = false }: { isLight?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: "el" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-0.5 text-[12px] tracking-[0.1em]">
      <button
        onClick={() => switchLocale("el")}
        className={`px-2 py-1 rounded-[2px] transition-all duration-300 ${
          locale === "el"
            ? isLight
              ? "text-white font-semibold"
              : "text-brand-800 font-semibold bg-brand-50"
            : isLight
            ? "text-white/40 hover:text-white/70"
            : "text-neutral-400 hover:text-neutral-600"
        }`}
      >
        EL
      </button>
      <span className={isLight ? "text-white/20" : "text-neutral-200"}>|</span>
      <button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 rounded-[2px] transition-all duration-300 ${
          locale === "en"
            ? isLight
              ? "text-white font-semibold"
              : "text-brand-800 font-semibold bg-brand-50"
            : isLight
            ? "text-white/40 hover:text-white/70"
            : "text-neutral-400 hover:text-neutral-600"
        }`}
      >
        EN
      </button>
    </div>
  );
}
