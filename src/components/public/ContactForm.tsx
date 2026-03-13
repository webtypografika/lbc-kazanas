"use client";

import { useTranslations } from "next-intl";
import { useState, FormEvent } from "react";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setStatus("idle");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setSending(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-400 font-medium mb-2.5">
            {t("name")} *
          </label>
          <input
            name="name"
            required
            placeholder={t("name")}
            className="w-full px-0 py-3 bg-transparent border-0 border-b border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:border-brand-800 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-400 font-medium mb-2.5">
            {t("email")} *
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder={t("email")}
            className="w-full px-0 py-3 bg-transparent border-0 border-b border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:border-brand-800 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-400 font-medium mb-2.5">
          {t("phone")}
        </label>
        <input
          name="phone"
          type="tel"
          placeholder={t("phone")}
          className="w-full px-0 py-3 bg-transparent border-0 border-b border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:border-brand-800 transition-colors"
        />
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-400 font-medium mb-2.5">
          {t("message")} *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t("message")}
          className="w-full px-0 py-3 bg-transparent border-0 border-b border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:border-brand-800 transition-colors resize-none"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-3 bg-brand-800 text-white px-10 py-4 text-[12px] uppercase tracking-[0.25em] font-medium rounded-[2px] hover:bg-brand-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? t("sending") : t("send")}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {status === "success" && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-[2px]">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm text-green-700">{t("success")}</p>
        </div>
      )}
      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-[2px]">
          <p className="text-sm text-red-700">{t("error")}</p>
        </div>
      )}
    </form>
  );
}
