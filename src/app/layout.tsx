import type { Metadata } from "next";
import { MotionConfig } from "motion/react";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { SoundProvider } from "@/lib/sound-context";
import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
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
      className={`${instrument.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-chalk text-mirage">
        <MotionConfig reducedMotion="user">
          <SoundProvider>{children}</SoundProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
