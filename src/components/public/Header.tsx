"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useState, useEffect } from "react";

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/" as const, label: t("home") },
    { href: "/projects" as const, label: t("projects") },
    { href: "/contact" as const, label: t("contact") },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // On home page and not scrolled = transparent header with white text
  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.5s",
        backgroundColor: isTransparent ? "transparent" : "#ffffff",
        boxShadow: isTransparent ? "none" : "0 1px 0 0 rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "80px",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.75rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: isTransparent ? "#ffffff" : "#0a2e3c",
                transition: "color 0.5s",
              }}
            >
              LBC
            </span>
            <div
              style={{
                borderLeft: `1px solid ${isTransparent ? "rgba(255,255,255,0.3)" : "#e5e5e5"}`,
                paddingLeft: "12px",
                transition: "border-color 0.5s",
              }}
              className="hidden sm:block"
            >
              <span
                style={{
                  display: "block",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  lineHeight: 1.5,
                  color: isTransparent ? "rgba(255,255,255,0.6)" : "#a3a3a3",
                  transition: "color 0.5s",
                }}
              >
                Luxury Building
                <br />
                Constructions
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex" style={{ alignItems: "center", gap: "2.5rem" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  position: "relative",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  padding: "8px 0",
                  transition: "color 0.3s",
                  color: isActive(link.href)
                    ? isTransparent
                      ? "#ffffff"
                      : "#0a2e3c"
                    : isTransparent
                    ? "rgba(255,255,255,0.7)"
                    : "#737373",
                }}
              >
                {link.label}
                {isActive(link.href) && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      backgroundColor: "#e5b13f",
                    }}
                  />
                )}
              </Link>
            ))}
            <div
              style={{
                borderLeft: `1px solid ${isTransparent ? "rgba(255,255,255,0.2)" : "#e5e5e5"}`,
                paddingLeft: "1.5rem",
                marginLeft: "0.5rem",
              }}
            >
              <LanguageSwitcher isLight={isTransparent} />
            </div>
          </nav>

          {/* Mobile */}
          <div className="flex md:hidden" style={{ alignItems: "center", gap: "1rem" }}>
            <LanguageSwitcher isLight={isTransparent} />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                padding: "8px",
                color: isTransparent ? "#ffffff" : "#0a2e3c",
                transition: "color 0.5s",
              }}
              aria-label="Menu"
            >
              <svg
                style={{ width: "24px", height: "24px" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden"
        style={{
          backgroundColor: "#ffffff",
          overflow: "hidden",
          transition: "max-height 0.3s",
          maxHeight: mobileOpen ? "250px" : "0",
          borderTop: mobileOpen ? "1px solid #f5f5f5" : "none",
        }}
      >
        <nav style={{ padding: "1.5rem" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                padding: "12px 0",
                borderBottom: "1px solid #fafafa",
                color: isActive(link.href) ? "#0a2e3c" : "#737373",
                fontWeight: isActive(link.href) ? 500 : 400,
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
