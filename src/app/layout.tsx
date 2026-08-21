import type { Metadata } from "next";
import { MotionConfig } from "motion/react";
import {
  JetBrains_Mono,
  Shantell_Sans,
  Source_Serif_4,
} from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://paardhiv.com"),
  title: "Paardhiv Sarakam — Software Engineer",
  description:
    "Software engineer and product builder. Ex-YC-backed and early-stage startups. Speedcuber. Building things that work and reading well.",
  openGraph: {
    title: "Paardhiv Sarakam — Software Engineer",
    description:
      "Software engineer and product builder. Ex-YC-backed and early-stage startups. Speedcuber.",
    type: "website",
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
        <MotionConfig reducedMotion="user">
          <SoundProvider>{children}</SoundProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
