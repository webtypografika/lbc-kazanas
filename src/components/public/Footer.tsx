import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const contact = useTranslations("contact.info");

  return (
    <footer style={{ backgroundColor: "#0a2e3c" }}>
      {/* Main footer */}
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "5rem 1.5rem 4rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "3rem",
          }}
          className="md:!grid-cols-3"
        >
          {/* Brand col */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.875rem",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.05em",
                marginBottom: "0.75rem",
              }}
            >
              LBC
            </h3>
            <div
              style={{
                width: "40px",
                height: "1px",
                backgroundColor: "#e5b13f",
                marginBottom: "1.25rem",
              }}
            />
            <p
              style={{
                color: "#a3a3a3",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                maxWidth: "280px",
              }}
            >
              {t("description")}
            </p>
          </div>

          {/* Links col */}
          <div>
            <h4
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "#e5b13f",
                marginBottom: "1.5rem",
                fontWeight: 500,
              }}
            >
              {t("links")}
            </h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { href: "/" as const, label: nav("home") },
                { href: "/projects" as const, label: nav("projects") },
                { href: "/contact" as const, label: nav("contact") },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: "0.875rem",
                    color: "#a3a3a3",
                    transition: "color 0.3s",
                  }}
                  className="hover:!text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact col */}
          <div>
            <h4
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "#e5b13f",
                marginBottom: "1.5rem",
                fontWeight: 500,
              }}
            >
              {t("contactTitle")}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
                  text: contact("addressValue"),
                },
                {
                  icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                  text: contact("phoneValue"),
                },
                {
                  icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  text: contact("emailValue"),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
                >
                  <svg
                    style={{
                      width: "16px",
                      height: "16px",
                      color: "#737373",
                      marginTop: "2px",
                      flexShrink: 0,
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={item.icon}
                    />
                  </svg>
                  <span style={{ fontSize: "0.875rem", color: "#a3a3a3" }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "#737373",
              letterSpacing: "0.05em",
            }}
          >
            &copy; {new Date().getFullYear()} LBC &mdash; Luxury Building
            Constructions. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
