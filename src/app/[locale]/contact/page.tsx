import { useTranslations } from "next-intl";
import ContactForm from "@/components/public/ContactForm";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <>
      {/* Page header */}
      <section style={{ paddingTop: "8rem", paddingBottom: "4rem", backgroundColor: "#fafafa" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.3em", color: "#c9962e", fontWeight: 500 }}>
            Contact
          </span>
          <div style={{ width: "40px", height: "1px", backgroundColor: "#e5b13f", margin: "1rem auto 2rem" }} />
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "#0a2e3c", marginBottom: "1.25rem" }}>
            {t("title")}
          </h1>
          <p style={{ color: "#737373", maxWidth: "32rem", margin: "0 auto" }}>
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 0 6rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div
            className="grid lg:grid-cols-5"
            style={{ gap: "4rem" }}
          >
            {/* Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-2">
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, color: "#0a2e3c", marginBottom: "2rem" }}>
                {t("info.title")}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {[
                  {
                    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
                    label: t("info.address"),
                    value: t("info.addressValue"),
                  },
                  {
                    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                    label: t("info.phone"),
                    value: t("info.phoneValue"),
                  },
                  {
                    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                    label: t("info.email"),
                    value: t("info.emailValue"),
                  },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        backgroundColor: "#e6f0f3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg style={{ width: "20px", height: "20px", color: "#0a2e3c" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#a3a3a3", fontWeight: 500, marginBottom: "4px" }}>
                        {item.label}
                      </h3>
                      <p style={{ fontSize: "0.875rem", color: "#262626" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div
                style={{
                  marginTop: "3rem",
                  aspectRatio: "4/3",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #e5e5e5",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <svg style={{ width: "32px", height: "32px", color: "#d4d4d4", margin: "0 auto 8px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#a3a3a3" }}>
                    Google Maps
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
