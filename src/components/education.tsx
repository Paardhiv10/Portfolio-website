"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { AsciiCampus } from "@/components/ascii-campus";
import { site } from "@/content/site";

type PorEntry = (typeof site.education.por)[number];

// Photos sit side by side rather than stacked — a stack buried everything
// under the top card. The tilts are the only thing left of the pile.
const TILT = [-4, 2.5, -2] as const;
/** Breathing room kept between the fan and the section's clipped edge. */
const EDGE_GUTTER = 24;

/** The photos, fanned out above whatever phrase carries them. Sized down on
 * phones so all three still fit across a narrow screen. */
function PhotoFan({
  images,
  label,
}: {
  images: readonly string[];
  label: string;
}) {
  // The fan hangs off a phrase that can sit far enough right to overflow the
  // clipped section. Measure once on open and pull it back inside.
  const ref = useRef<HTMLSpanElement>(null);
  const [shift, setShift] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    const section = el?.closest("section");
    if (!el || !section) return;
    const overflow =
      el.getBoundingClientRect().right -
      (section.getBoundingClientRect().right - EDGE_GUTTER);
    if (overflow > 0) setShift(-overflow);
  }, []);

  return (
    <span
      ref={ref}
      style={{ transform: `translateX(${shift}px)` }}
      className="pointer-events-none absolute bottom-full left-0 z-20 mb-4 flex gap-2 sm:gap-3"
    >
      {images.map((src, i) => (
        <motion.span
          key={src}
          initial={{ opacity: 0, y: 10, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: TILT[i % TILT.length] }}
          exit={{ opacity: 0, y: 10, rotate: 0 }}
          transition={{ duration: 0.22, delay: i * 0.05, ease: "easeOut" }}
          className="relative block h-20 w-24 shrink-0 overflow-hidden rounded-lg border-4 border-white shadow-[0_14px_28px_-8px_rgba(27,29,26,0.4)] sm:h-28 sm:w-36"
        >
          <Image
            src={src}
            alt={`${label} — photo ${i + 1}`}
            fill
            sizes="(min-width: 640px) 144px, 96px"
            className="object-cover"
          />
        </motion.span>
      ))}
    </span>
  );
}

/** A club/role row. The photos hang off a phrase inside the bullets, not the
 * role title, so the thing you hover is the thing they are of. */
function PorItem({ p }: { p: PorEntry }) {
  // Two flags, not one: with a single one a click while hovering would toggle
  // the photos straight back off. Hover for a mouse, pin for a tap.
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || pinned;

  /** Splits a bullet around `highlight` so the phrase can carry the photos.
   * Falls back to the plain string when the phrase isn't in this bullet. */
  function renderBullet(bullet: string) {
    const at = bullet.indexOf(p.highlight);
    if (at === -1) return bullet;

    return (
      <>
        {bullet.slice(0, at)}
        {/* A span, not a button, so the phrase still wraps with the sentence. `static`
            below sm anchors the fan to the row, not to a wrapped inline box. */}
        <span
          role="button"
          tabIndex={0}
          aria-expanded={open}
          className="static cursor-pointer underline decoration-ink/30 decoration-1 underline-offset-4 transition-colors hover:decoration-ink/60 sm:relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          // Touch fires enter then leave on a tap, so hover alone only ever
          // flickered the photos on a phone. Tapping pins them instead.
          onClick={() => setPinned((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setPinned((v) => !v);
            }
          }}
        >
          {p.highlight}
          <AnimatePresence>
            {open && p.images.length > 0 && (
              <PhotoFan images={p.images} label={p.org} />
            )}
          </AnimatePresence>
        </span>
        {bullet.slice(at + p.highlight.length)}
      </>
    );
  }

  return (
    <li className="relative border-b border-ink/15 pb-8 last:border-b-0 last:pb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-serif text-2xl leading-tight tracking-tight">
          {p.role}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink/45">
          {p.dates}
        </p>
      </div>
      <p className="mt-1.5 text-sm text-ink/65">{p.org}</p>

      <ul className="mt-4 space-y-2">
        {p.bullets.map((b) => (
          <li
            key={b}
            className="flex gap-2.5 text-base leading-relaxed text-ink/70"
          >
            <span
              aria-hidden
              className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ink/35"
            />
            <span>{renderBullet(b)}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

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
          // Uncapped: the line wants 853px and the section gives 1152, so a
          // max-width was the only thing breaking it in two. Wraps on phones.
          className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl"
        >
          I got my degree between these arches
        </motion.h2>

        {/* Art left, photo and copy right. The art column is wider on purpose — the ASCII
            grid is 140 glyphs across and needs the pixels. Single stack below lg. */}
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
            {/* No border: the stamp brings its own. drop-shadow follows the
                scalloped edge; `contain` and the height cap keep it whole. */}
            <div className="relative mx-auto aspect-[952/1167] w-full max-h-[26rem] max-w-[calc(26rem*952/1167)] sm:max-h-[30rem] sm:max-w-[calc(30rem*952/1167)]">
              <Image
                src="/education/grad-stamp.webp"
                alt="A postage stamp of a young graduate in cap and gown, holding a rolled diploma"
                fill
                // Capped by max-w, so this is a known width, not a share of
                // the viewport.
                sizes="(min-width: 640px) 392px, 90vw"
                className="object-contain [filter:drop-shadow(0_10px_18px_rgba(27,29,26,0.20))]"
              />
            </div>

            <p className="mt-6 text-base leading-relaxed text-ink/65">
              I graduated from MIT Manipal with an ECE degree, but spent most of
              my time outside the classroom — in student clubs like Hult Prize
              and E-Cell, doing a bunch of internships, and building CubeCoast
              while exploring and learning more about startups. These four years
              at college have been truly transformational.
            </p>
          </motion.div>
        </div>

        {/* Positions of responsibility, stacked end to end. The hover photos float above
            the row rather than needing reserved space. */}
        <div className="mt-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
              Where I Showed Up
            </p>

            <ul className="mt-4 flex flex-col gap-10">
              {site.education.por.map((p) => (
                <PorItem key={p.org} p={p} />
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
