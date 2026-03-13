import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import FeaturedProjects from "@/components/public/FeaturedProjects";

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        {/* Background */}
        <div className="absolute inset-0" style={{ backgroundColor: "#051a24" }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,46,60,0.95) 0%, rgba(5,26,36,0.85) 50%, rgba(10,46,60,0.9) 100%)",
          }}
        />
        {/* Decorative lines */}
        <div
          className="absolute top-0 h-full"
          style={{ left: "25%", width: "1px", backgroundColor: "rgba(255,255,255,0.04)" }}
        />
        <div
          className="absolute top-0 h-full"
          style={{ left: "50%", width: "1px", backgroundColor: "rgba(255,255,255,0.04)" }}
        />
        <div
          className="absolute top-0 h-full"
          style={{ left: "75%", width: "1px", backgroundColor: "rgba(255,255,255,0.04)" }}
        />

        <div className="relative z-10 text-center px-6" style={{ maxWidth: "56rem", margin: "0 auto" }}>
          {/* Small label */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span style={{ width: "32px", height: "1px", backgroundColor: "#e5b13f" }} />
            <span
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.4em",
                color: "#e5b13f",
                fontWeight: 500,
              }}
            >
              LBC
            </span>
            <span style={{ width: "32px", height: "1px", backgroundColor: "#e5b13f" }} />
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "2rem",
            }}
          >
            {t("hero.title")}
          </h1>

          <p
            style={{
              fontSize: "1.125rem",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "40rem",
              margin: "0 auto 3rem",
              lineHeight: 1.7,
            }}
          >
            {t("hero.subtitle")}
          </p>

          <Link
            href="/projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "16px 40px",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              fontWeight: 500,
              borderRadius: "2px",
              transition: "all 0.5s",
            }}
            className="hover:bg-white hover:text-brand-800"
          >
            {t("hero.cta")}
            <svg
              style={{ width: "16px", height: "16px" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Bottom scroll indicator */}
        <div
          className="absolute left-1/2"
          style={{ bottom: "40px", transform: "translateX(-50%)" }}
        >
          <div
            style={{
              width: "1px",
              height: "64px",
              background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))",
            }}
          />
        </div>
      </section>

      {/* About */}
      <section style={{ padding: "6rem 0" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div
            className="grid lg:grid-cols-2 items-center"
            style={{ gap: "4rem" }}
          >
            <div>
              <span
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.3em",
                  color: "#c9962e",
                  fontWeight: 500,
                }}
              >
                {t("about.title")}
              </span>
              <div
                style={{
                  width: "40px",
                  height: "1px",
                  backgroundColor: "#e5b13f",
                  margin: "1rem 0 2rem",
                }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  color: "#0a2e3c",
                  lineHeight: 1.15,
                  marginBottom: "1.5rem",
                }}
              >
                {t("about.title")}
              </h2>
              <p
                style={{
                  color: "#737373",
                  lineHeight: 1.7,
                  fontSize: "1rem",
                  marginBottom: "3rem",
                }}
              >
                {t("about.description")}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3" style={{ gap: "2rem" }}>
                {[
                  { num: "15+", label: t("about.experience") },
                  { num: "200+", label: t("about.completedProjects") },
                  { num: "100%", label: t("about.satisfaction") },
                ].map((stat, i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "2rem",
                        fontWeight: 700,
                        color: "#0a2e3c",
                      }}
                    >
                      {stat.num}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#a3a3a3",
                        marginTop: "0.5rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        lineHeight: 1.4,
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image placeholder */}
            <div className="relative">
              <div
                style={{
                  aspectRatio: "3/4",
                  background: "linear-gradient(135deg, #e6f0f3 0%, #f5f5f5 100%)",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="text-center">
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "3rem",
                      fontWeight: 700,
                      color: "#96c3cf",
                    }}
                  >
                    LBC
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.3em",
                      color: "#6cabbb",
                      marginTop: "0.5rem",
                    }}
                  >
                    Since 2009
                  </div>
                </div>
              </div>
              {/* Decorative border */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-16px",
                  right: "-16px",
                  width: "100%",
                  height: "100%",
                  border: "1px solid #ecc56f",
                  borderRadius: "2px",
                  zIndex: -1,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: "6rem 0", backgroundColor: "#fafafa" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div className="text-center" style={{ marginBottom: "4rem" }}>
            <span
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                color: "#c9962e",
                fontWeight: 500,
              }}
            >
              {t("services.title")}
            </span>
            <div
              style={{
                width: "40px",
                height: "1px",
                backgroundColor: "#e5b13f",
                margin: "1rem auto 2rem",
              }}
            />
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                color: "#0a2e3c",
              }}
            >
              {t("services.title")}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "1.5rem" }}>
            {[
              {
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                title: t("services.construction"),
                desc: t("services.constructionDesc"),
              },
              {
                icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
                title: t("services.renovation"),
                desc: t("services.renovationDesc"),
              },
              {
                icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
                title: t("services.interior"),
                desc: t("services.interiorDesc"),
              },
              {
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
                title: t("services.consulting"),
                desc: t("services.consultingDesc"),
              },
            ].map((service, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "2.5rem 2rem",
                  borderRadius: "2px",
                  border: "1px solid #f5f5f5",
                  transition: "all 0.4s",
                }}
                className="hover:shadow-lg hover:shadow-brand-800/5 group"
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: "#e6f0f3",
                  }}
                >
                  <svg
                    style={{ width: "24px", height: "24px", color: "#0a2e3c" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={service.icon}
                    />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "#0a2e3c",
                    marginBottom: "0.75rem",
                  }}
                >
                  {service.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#737373", lineHeight: 1.7 }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section style={{ padding: "6rem 0" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div
            className="flex flex-col sm:flex-row sm:items-end justify-between"
            style={{ marginBottom: "3rem" }}
          >
            <div>
              <span
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.3em",
                  color: "#c9962e",
                  fontWeight: 500,
                }}
              >
                Portfolio
              </span>
              <div
                style={{
                  width: "40px",
                  height: "1px",
                  backgroundColor: "#e5b13f",
                  margin: "1rem 0 2rem",
                }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  color: "#0a2e3c",
                }}
              >
                {t("featured.title")}
              </h2>
            </div>
            <Link
              href="/projects"
              className="group"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: "#0a2e3c",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginTop: "1.5rem",
              }}
            >
              {t("featured.viewAll")}
              <svg
                className="group-hover:translate-x-1 transition-transform"
                style={{ width: "16px", height: "16px" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
          <FeaturedProjects />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ padding: "6rem 0" }}>
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "#0a2e3c" }}
        />
        <div
          className="absolute top-0 right-0 h-full"
          style={{
            width: "50%",
            background: "linear-gradient(to left, rgba(5,26,36,0.5), transparent)",
          }}
        />

        <div
          className="relative z-10 text-center"
          style={{ maxWidth: "48rem", margin: "0 auto", padding: "0 1.5rem" }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <span style={{ width: "32px", height: "1px", backgroundColor: "#e5b13f" }} />
            <span
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.4em",
                color: "#e5b13f",
                fontWeight: 500,
              }}
            >
              Contact
            </span>
            <span style={{ width: "32px", height: "1px", backgroundColor: "#e5b13f" }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "1.25rem",
            }}
          >
            {t("cta.title")}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "3rem", fontSize: "1rem" }}>
            {t("cta.subtitle")}
          </p>
          <Link
            href="/contact"
            className="hover:bg-white hover:text-brand-800"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "16px 40px",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              fontWeight: 500,
              borderRadius: "2px",
              transition: "all 0.5s",
            }}
          >
            {t("cta.button")}
            <svg
              style={{ width: "16px", height: "16px" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
