import type { Metadata } from "next";
import { MotionConfig } from "motion/react";
import {
  JetBrains_Mono,
  Shantell_Sans,
  Source_Serif_4,
} from "next/font/google";
import { site } from "@/content/site";
import { SoundProvider } from "@/lib/sound-context";
import "./globals.css";

// Carries the whole site — display headings and body copy both. The `opsz`
// axis is what makes that work: the browser fits the optical size to the
// rendered size, so the same face stays sturdy at 12px and fine at 13vw.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

// Marker hand for the sticky notes only. Shantell Sans is the rare marker face
// that stays legible in a paragraph — Permanent Marker and friends fall apart
// below ~20px, and the notes carry real body copy.
const shantell = Shantell_Sans({
  variable: "--font-shantell",
  subsets: ["latin"],
  display: "swap",
});

const DESCRIPTION =
  "Software engineer and product builder. Ex-YC-backed and early-stage startups. Speedcuber. Building things that work and reading well.";

export const metadata: Metadata = {
  metadataBase: new URL("https://paardhiv.com"),
  // The template gives every child page a consistent suffix, so a page only
  // has to declare its own name.
  title: {
    default: "Paardhiv Sarakam — Software Engineer",
    template: "%s — Paardhiv Sarakam",
  },
  description: DESCRIPTION,
  // Prevents query strings or alternate hosts from indexing as duplicate pages.
  alternates: { canonical: "/" },
  openGraph: {
    title: "Paardhiv Sarakam — Software Engineer",
    description: DESCRIPTION,
    type: "website",
    url: "/",
    siteName: "Paardhiv Sarakam",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paardhiv Sarakam — Software Engineer",
    description: DESCRIPTION,
    creator: "@PaardhivS",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${jetbrains.variable} ${shantell.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-chalk text-mirage">
        {/* Person schema: ties name, role, and links into one search entity. */}
        <script
          type="application/ld+json"
          // Sourced from site.ts so it can't drift from the rendered page.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: site.name,
              url: "https://paardhiv.com",
              jobTitle: site.role,
              email: `mailto:${site.email}`,
              address: {
                "@type": "PostalAddress",
                addressCountry: site.location,
              },
              sameAs: [
                site.social.github,
                site.social.linkedin,
                site.social.twitter,
                "https://www.worldcubeassociation.org/persons/2016PAAR01",
              ],
            }),
          }}
        />
        <MotionConfig reducedMotion="user">
          <SoundProvider>{children}</SoundProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
