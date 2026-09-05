import Link from "next/link";
import type { ReactNode } from "react";
import { GrainOverlay } from "@/components/grain-overlay";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";

/**
 * Shared shell for the three interest pages, so /sneakers, /music and /travel
 * open into the same room the Interests section belongs to rather than looking
 * like a different site.
 */
export function CollectionPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section className="relative bg-cream px-6 pt-32 pb-24 text-mirage sm:px-10 sm:pt-36 lg:px-16">
          <GrainOverlay opacity={0.045} />

          <div className="relative mx-auto max-w-6xl">
            <Link
              href="/#interests"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mirage/45 transition-colors hover:text-orange"
            >
              <span aria-hidden>&larr;</span> Back to interests
            </Link>

            <p className="mt-10 mb-3 font-mono text-xs uppercase tracking-[0.25em] text-orange">
              {eyebrow}
            </p>
            <h1 className="font-display text-5xl tracking-tight sm:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-[1.5] text-mirage/70">
              {intro}
            </p>

            <div className="mt-16">{children}</div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
