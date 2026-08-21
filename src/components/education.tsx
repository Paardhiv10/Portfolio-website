"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { AsciiCampus } from "@/components/ascii-campus";
import { site } from "@/content/site";

export function Education() {
  return (
    <section
      id="education"
      className="relative overflow-hidden bg-cream px-6 py-28 text-ink sm:px-10 lg:px-16"
    >
      <div className="relative mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-ink/55"
        >
          Education
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="max-w-3xl font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl"
        >
          I got my degree between these arches
        </motion.h2>

        {/* Top row: art left, photo + copy right. The art column is the wider
            of the two on purpose — the ASCII grid is 140 glyphs across, and
            legibility depends on how many pixels each glyph gets. Each column
            closes with its own rule; the grid stretches them to a shared
            height, so the two land level and read as one line broken by the
            gutter. Below lg they fall back to a single stack, art first. */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
          {/* campus, rendered as ASCII so it sits in the same visual language
              as the hero portrait rather than as a pasted photo */}
          <div className="@container flex w-full justify-center border-b border-ink/20 pb-12">
            <AsciiCampus />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-center border-b border-ink/20 pb-12"
          >
            {/* The source is 1250×1680, so the frame is 3:4 to match. The
                placeholder here was 4:3, which would have cropped a portrait
                photo down to a horizontal band through the middle. */}
            <div className="relative aspect-[3/4] w-full overflow-hidden border border-ink/15 bg-ink/5">
              <Image
                src="/education/grad.png"
                alt="Graduation day"
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* TODO(paardhiv): placeholder copy */}
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
              Placeholder
            </p>
            <p className="mt-3 text-base leading-relaxed text-ink/65">
              A couple of lines about the place, sitting under the photo. Enough
              copy here to show how the column breathes without crowding the
              art beside it.
            </p>
          </motion.div>
        </div>

        {/* the degree and the clubs, moved below the row and given the full
            width to spread across */}
        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
              The Degree
            </p>
            <p className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
              {site.education.degree}
            </p>
            <p className="mt-3 text-base text-ink/65">
              {site.education.university}
            </p>
          </motion.div>

          {/* positions of responsibility — plain rows, no cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
              Where I Showed Up
            </p>

            <ul className="mt-4">
              {site.education.por.map((p) => (
                <li
                  key={p.org}
                  className="border-b border-ink/15 py-5 last:border-b-0 last:pb-0"
                >
                  <p className="font-serif text-2xl leading-tight tracking-tight">
                    {p.role}
                  </p>
                  <p className="mt-1.5 text-sm text-ink/65">{p.org}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink/45">
                    {p.dates}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
