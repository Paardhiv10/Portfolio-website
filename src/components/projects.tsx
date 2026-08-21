"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { GrainOverlay } from "@/components/grain-overlay";
import { site } from "@/content/site";
import { useSound } from "@/lib/sound-context";

// The notes run on three colours and no more. Keying this off the data's own
// union rather than `string` means adding a fourth to site.ts is a type error
// here instead of a note that silently renders with no background.
const CARD_BG: Record<(typeof site.projects)[number]["color"], string> = {
  canary: "bg-canary text-mirage",
  aqua: "bg-aqua text-mirage",
  orange: "bg-orange text-mirage",
};

type Project = (typeof site.projects)[number];

/** Corner peel, in px: how much is turned up at rest and under the cursor. */
const PEEL_REST = 20;
const PEEL_HOVER = 54;

function StickyNote({ project, index }: { project: Project; index: number }) {
  const { play } = useSound();
  const [lifted, setLifted] = useState(false);

  // One number drives both the cut and the flap that fills it, so the two can
  // never disagree mid-animation. A CSS transition rather than a spring: the
  // cut corner and the flap are separate properties on separate elements, and
  // a shared easing keeps them locked together frame for frame.
  const peel = lifted ? PEEL_HOVER : PEEL_REST;
  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: project.rotate }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ rotate: 0, y: -6 }}
      onHoverStart={() => {
        setLifted(true);
        play("hover");
      }}
      onHoverEnd={() => setLifted(false)}
      onClick={() => play("sticky")}
      // drop-shadow rather than box-shadow: box-shadow traces the element's
      // box, so it would draw a square corner over the cut-away one. The
      // filter follows the clipped silhouette instead.
      className={`relative cursor-pointer transition-[filter] duration-300 ${
        lifted
          ? "[filter:drop-shadow(0_20px_24px_rgba(0,0,0,0.42))]"
          : "[filter:drop-shadow(0_10px_14px_rgba(0,0,0,0.34))]"
      }`}
    >
      <article
        style={{
          // The corner is genuinely cut out of the sheet rather than covered by
          // a triangle of flat colour — that way the mat's grid and grain show
          // through the gap, which is what sells it as paper on a surface.
          clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${peel}px), calc(100% - ${peel}px) 100%, 0 100%)`,
          transition: `clip-path 420ms ${ease}`,
        }}
        className={`relative overflow-hidden p-7 ${CARD_BG[project.color]}`}
      >
        <GrainOverlay opacity={0.09} />

        {/* adhesive strip — the band at the top of a real pad, where the glue
            darkens the paper slightly */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-16"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.10), rgba(0,0,0,0.03) 60%, transparent)",
          }}
        />

        {/* the paper's own shading: lit from the top-left, dropping off toward
            the corner that lifts */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.20), transparent 40%, rgba(0,0,0,0.10))",
          }}
        />

        {/* The eyebrow stays mono — it reads as a printed index stamp on the
            note, and keeps the label system consistent across every section.
            Everything hand-written on the note is marker. */}
        <p className="relative mb-5 font-mono text-[11px] uppercase tracking-widest opacity-60">
          Experiment {String(index + 1).padStart(2, "0")} — {project.type}
        </p>

        <h3 className="relative font-marker text-2xl font-bold leading-tight">
          {project.title}
        </h3>

        {project.metric && (
          <p className="relative mt-3 flex items-baseline gap-2">
            <span className="font-marker text-5xl font-semibold leading-none tracking-tight">
              {project.metric.value}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest opacity-60">
              {project.metric.label}
            </span>
          </p>
        )}

        <p className="relative mt-4 font-marker text-sm leading-relaxed opacity-80">
          {project.description}
        </p>

        {/* the turned-up flap, sitting just inside the cut and showing the
            underside of the sheet: shadowed along the crease, catching light
            at the tip */}
        <div
          aria-hidden
          style={{
            width: peel,
            height: peel,
            transition: `width 420ms ${ease}, height 420ms ${ease}`,
          }}
          className="pointer-events-none absolute bottom-0 right-0"
        >
          {/* Folding the corner up maps it onto the triangle nearest the note's
              middle, so this is the top-left half of the box — the bottom-right
              half is the hole the sheet's clip-path already cut. The crease is
              the hypotenuse (dark, lying flat) and the tip is the free corner
              (light, lifted highest). */}
          <div
            style={{
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(0,0,0,0.06) 45%, rgba(0,0,0,0.4))",
              filter: "drop-shadow(-3px -3px 5px rgba(0,0,0,0.28))",
            }}
            className="h-full w-full"
          />
        </div>
      </article>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      className="relative bg-chalk px-4 py-14 sm:px-8 sm:py-20 lg:px-12"
    >
      {/* the mat itself — inset from the viewport so it reads as a physical
          object lying on the page rather than a full-bleed background */}
      <div className="relative overflow-hidden rounded-[26px] bg-mat-green px-6 py-24 shadow-[0_30px_70px_-30px_rgba(23,51,44,0.75)] sm:rounded-[40px] sm:px-10 lg:px-16">
        {/* cutting-mat grid — tonal, not yellow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(to right, var(--color-mat-green-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-mat-green-line) 1px, transparent 1px),
            linear-gradient(to right, var(--color-mat-green-line) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, var(--color-mat-green-line) 1.5px, transparent 1.5px)
          `,
            backgroundSize: "20px 20px, 20px 20px, 100px 100px, 100px 100px",
            opacity: 0.4,
          }}
        />
        {/* ruler tick strip, top edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-6 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, var(--color-chalk) 0 1px, transparent 1px 10px)",
            backgroundPosition: "0 100%",
            backgroundSize: "10px 10px",
            backgroundRepeat: "repeat-x",
          }}
        />
        {/* worn/scuffed feel — a few faint, irregular knife-cut streaks */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
            repeating-linear-gradient(41deg, var(--color-chalk) 0 1px, transparent 1px 260px),
            repeating-linear-gradient(-18deg, var(--color-chalk) 0 1px, transparent 1px 340px)
          `,
          }}
        />
        {/* worn/scuffed feel — a few duller, desaturated patches from repeated use */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
            radial-gradient(ellipse 420px 240px at 12% 25%, rgba(0,0,0,0.22), transparent 70%),
            radial-gradient(ellipse 320px 260px at 85% 70%, rgba(0,0,0,0.18), transparent 70%),
            radial-gradient(ellipse 300px 200px at 55% 10%, var(--color-mat-green-line), transparent 70%)
          `,
          }}
        />
        {/* heavier grain for a used, less-pristine surface */}
        <GrainOverlay opacity={0.1} />
        {/* vignette to ground the edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.35) 100%)",
          }}
        />
        {/* soft bevel — catches light on the top edge and darkens the bottom,
          so the rounded corners read as a thick rubber mat */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[26px] sm:rounded-[40px]"
          style={{
            boxShadow:
              "inset 0 1.5px 1px rgba(232,235,243,0.16), inset 0 -2px 3px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.25)",
          }}
        />

        <div className="relative mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-aqua"
          >
            Projects
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-5xl tracking-tight text-chalk sm:text-6xl"
          >
            Things on the Mat
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-xl text-lg leading-relaxed text-chalk/70"
          >
            A few things I&apos;ve cut, measured twice, and shipped.
          </motion.p>

          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {site.projects.map((project, i) => (
              <StickyNote key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
