"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AsciiCampus } from "@/components/ascii-campus";
import { site } from "@/content/site";

type PorEntry = (typeof site.education.por)[number];

// Side by side, not stacked — a stack buried everything under the top card.
const TILT = [-4, 2.5, -2] as const;
/** Breathing room kept between the fan and the section's clipped edge. */
const EDGE_GUTTER = 24;

/** The photos, fanned above the phrase; sized down so three fit on a phone. */
function PhotoFan({
  images,
  label,
}: {
  images: readonly string[];
  label: string;
}) {
  // A late phrase can push the fan past the clipped section; pull it back in.
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

/** A club row: photos hang off a phrase in the summary, not the club name. */
function PorItem({ p }: { p: PorEntry }) {
  // Two flags: one would let a click while hovering toggle the photos off.
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || pinned;
  const triggerRef = useRef<HTMLSpanElement>(null);

  function close() {
    setPinned(false);
    setHovered(false);
  }

  // A pinned fan closes on any press outside the phrase, or on Escape.
  useEffect(() => {
    if (!pinned) return;
    function onPointerDown(e: PointerEvent) {
      if (!triggerRef.current?.contains(e.target as Node)) close();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pinned]);

  /** Click or Enter: pin the fan open (hover alone does not), or close a pinned one. */
  function toggle() {
    if (pinned) close();
    else setPinned(true);
  }

  /** Splits the summary around `highlight`, or returns it plain if absent. */
  function renderSummary(text: string) {
    const at = text.indexOf(p.highlight);
    if (at === -1) return text;

    return (
      <>
        {text.slice(0, at)}
        {/* A span so the phrase still wraps; `static` below sm anchors the fan. */}
        <span
          role="button"
          tabIndex={0}
          aria-expanded={open}
          ref={triggerRef}
          className="static cursor-pointer underline decoration-ink/30 decoration-1 underline-offset-4 transition-colors hover:decoration-ink/60 sm:relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          // Tabbing away closes it; focus alone does not open it, or a click could not close it.
          onBlur={close}
          // Touch fires enter then leave on a tap, so a tap pins instead of hovering.
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
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
        {text.slice(at + p.highlight.length)}
      </>
    );
  }

  return (
    <li className="relative">
      <p className="font-serif text-xl leading-tight tracking-tight">{p.org}</p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink/45">
        {p.role} · {p.dates}
      </p>
      <p className="mt-3 text-base leading-relaxed text-ink/70">
        {renderSummary(p.summary)}
      </p>
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
          // Uncapped: a max-width was the only thing breaking this line in two.
          className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl"
        >
          I got my degree between these arches
        </motion.h2>

        {/* Art left, photo and copy right; the ASCII grid needs the wider column. */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
          {/* Campus as ASCII, so it speaks the same language as the hero portrait. */}
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
            {/* No border — the stamp brings its own, and drop-shadow follows its scallops. */}
            <div className="relative mx-auto aspect-[952/1167] w-full max-h-[26rem] max-w-[calc(26rem*952/1167)] sm:max-h-[30rem] sm:max-w-[calc(30rem*952/1167)]">
              <Image
                src="/education/grad-stamp.webp"
                alt="A postage stamp of a young graduate in cap and gown, holding a rolled diploma"
                fill
                // Capped by max-w, so the width is a known px, not a share of the viewport.
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

        {/* Positions of responsibility, stacked; the hover photos float above the row. */}
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

            <ul className="mt-6 grid gap-10 sm:grid-cols-2 sm:gap-12">
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
