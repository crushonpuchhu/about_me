import type { Metadata, Viewport } from "next";
import "../styles/tokens.css";
import "../styles/site.css";
import Providers from "@/components/Providers";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Motion from "@/components/Motion";
import { data, site } from "@/lib/content";

const description = `${site.title}. ${data.about.shortDescription}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://mittalkumargupta.com"),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    "Mittal Kumar Gupta",
    "AI engineer",
    "full stack developer",
    "machine learning",
    "Next.js developer",
    "AI agents",
    "Bangalore",
  ],
  authors: [{ name: site.name, url: "https://mittalkumargupta.com" }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: `${site.name} — ${site.title}`,
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name}: ${site.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.title}`,
    description,
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
};

const boot = `(() => {
  try {
    const root = document.documentElement;
    const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
    const theme = read("mg-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    root.dataset.theme = theme;
    root.dataset.accent = read("mg-accent") || "blue";
    let seen = null;
    try { seen = sessionStorage.getItem("mg-preloaded"); } catch {}
    if (seen) root.dataset.preloaded = "yes";
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) root.dataset.preloaded = "yes";
    root.classList.add("js");
    setTimeout(() => {
      if (!root.dataset.motion) root.dataset.motion = "ready";
    }, 3200);
  } catch (e) {}
})();`;

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.title,
  url: "https://mittalkumargupta.com",
  email: `mailto:${site.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangalore",
    addressCountry: "IN",
  },
  knowsAbout: data.about.interests,
  sameAs: [site.github],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" data-accent="blue" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      </head>
      <body className="frame">
        <a href="#main" className="skip note">
          Skip to content
        </a>
        <Providers>
          <SiteHeader />
          <a
            className="side-tab"
            href="/contact"
            aria-label={`${site.availability}: get in touch`}
          >
            <span className="side-tab__mark" aria-hidden="true">
              {site.monogram}.
            </span>
            <span className="side-tab__label">Available</span>
          </a>
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </Providers>
        <Motion />
      </body>
    </html>
  );
}
