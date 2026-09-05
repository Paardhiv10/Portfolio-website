"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
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

// The mat's printed surface. The board is 60 units wide however wide it
// renders, so the ruler always runs edge to edge and the grid squares stay
// square — the unit is derived from a measured width rather than fixed, and
// everything is drawn in real pixels rather than a stretched viewBox. A
// stretched one would flatten the protractor's arc into an ellipse and
// throw every angle off the moment the mat's aspect ratio changed.
const MAT_UNITS_W = 60;
/** Gap between the mat's edge and the ruled area, where the rulers sit. */
const MAT_INSET = 34;
const MAT_ARC_UNITS = 10;
const MAT_ANGLES = [15, 30, 45, 60];
// Kept faint on purpose: the section's heading and intro sit straight on the
// mat rather than on a sticky note, and a stronger print fights them.
const MAT_GOLD = "rgba(201, 208, 120, 0.26)";
const MAT_GOLD_TICK = "rgba(201, 208, 120, 0.34)";
const MAT_GOLD_TEXT = "rgba(201, 208, 120, 0.48)";
const MAT_GOLD_DASH = "rgba(201, 208, 120, 0.22)";

/** Measures the mat's box so the print can be laid out against real pixels. */
function useBoxSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      setBox({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, box] as const;
}

/** Grid, edge rulers, angle guides and protractor — the whole printed mat. */
function MatPrint({ width, height }: { width: number; height: number }) {
  if (width <= 0 || height <= 0) return null;

  const left = MAT_INSET;
  const right = width - MAT_INSET;
  const top = MAT_INSET;
  const bottom = height - MAT_INSET;
  const unit = (right - left) / MAT_UNITS_W;
  if (unit <= 0) return null;

  const unitsH = Math.floor((bottom - top) / unit);
  const x = (u: number) => left + u * unit;
  const y = (v: number) => bottom - v * unit;
  const cols = Array.from({ length: MAT_UNITS_W + 1 }, (_, i) => i);
  const rows = Array.from({ length: unitsH + 1 }, (_, i) => i);
  const every5 = (n: number) => n % 5 === 0;

  return (
    <svg
      aria-hidden
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="pointer-events-none absolute inset-0"
    >
      <defs>
        <clipPath id="mat-ruled-area">
          <rect x={left} y={top} width={right - left} height={bottom - top} />
        </clipPath>
      </defs>

      {/* the fine every-unit grid, tonal rather than gold */}
      <g stroke="var(--color-mat-green-line)" strokeWidth={1}>
        {cols.map((i) => (
          <line key={`fine-v-${i}`} x1={x(i)} y1={top} x2={x(i)} y2={bottom} />
        ))}
        {rows.map((j) => (
          <line key={`fine-h-${j}`} x1={left} y1={y(j)} x2={right} y2={y(j)} />
        ))}
      </g>

      {/* the printed every-5 grid */}
      <g stroke={MAT_GOLD} strokeWidth={1}>
        {cols.filter(every5).map((i) => (
          <line key={`major-v-${i}`} x1={x(i)} y1={top} x2={x(i)} y2={bottom} />
        ))}
        {rows.filter(every5).map((j) => (
          <line key={`major-h-${j}`} x1={left} y1={y(j)} x2={right} y2={y(j)} />
        ))}
      </g>

      {/* angle guides — all four run the full mat, clipped to the ruled area */}
      <g clipPath="url(#mat-ruled-area)">
        {MAT_ANGLES.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const len = (right - left) * 1.6;
          return (
            <line
              key={`angle-${deg}`}
              x1={x(0)}
              y1={y(0)}
              x2={x(0) + Math.cos(rad) * len}
              y2={y(0) - Math.sin(rad) * len}
              stroke={MAT_GOLD_DASH}
              strokeWidth={1}
              strokeDasharray="4 6"
            />
          );
        })}
        <path
          d={`M ${x(MAT_ARC_UNITS)} ${y(0)} A ${MAT_ARC_UNITS * unit} ${MAT_ARC_UNITS * unit} 0 0 0 ${x(0)} ${y(MAT_ARC_UNITS)}`}
          fill="none"
          stroke={MAT_GOLD_TICK}
          strokeWidth={1.2}
        />
      </g>

      {/* angle labels, tucked just inside the arc */}
      <g fontSize={10} fill={MAT_GOLD_TEXT} className="font-mono">
        {MAT_ANGLES.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const r = (MAT_ARC_UNITS - 1.4) * unit;
          return (
            <text
              key={`angle-label-${deg}`}
              x={x(0) + Math.cos(rad) * r}
              y={y(0) - Math.sin(rad) * r}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {deg}°
            </text>
          );
        })}
      </g>

      {/* ruler ticks, all four edges, longer every 5 */}
      <g stroke={MAT_GOLD_TICK} strokeWidth={1}>
        {cols.map((i) => {
          const len = every5(i) ? 12 : 7;
          return (
            <g key={`tick-col-${i}`}>
              <line x1={x(i)} y1={top - len} x2={x(i)} y2={top} />
              <line x1={x(i)} y1={bottom} x2={x(i)} y2={bottom + len} />
            </g>
          );
        })}
        {rows.map((j) => {
          const len = every5(j) ? 12 : 7;
          return (
            <g key={`tick-row-${j}`}>
              <line x1={left - len} y1={y(j)} x2={left} y2={y(j)} />
              <line x1={right} y1={y(j)} x2={right + len} y2={y(j)} />
            </g>
          );
        })}
      </g>

      {/* ruler numbers, outside the ruled area on all four edges */}
      <g fontSize={10} fill={MAT_GOLD_TEXT} className="font-mono">
        {cols.filter(every5).map((i) => (
          <g key={`num-col-${i}`}>
            <text x={x(i)} y={top - 16} textAnchor="middle">
              {i}
            </text>
            <text x={x(i)} y={bottom + 24} textAnchor="middle">
              {i}
            </text>
          </g>
        ))}
        {rows.filter(every5).map((j) => (
          <g key={`num-row-${j}`} dominantBaseline="middle">
            <text x={left - 16} y={y(j)} textAnchor="end">
              {j}
            </text>
            <text x={right + 16} y={y(j)} textAnchor="start">
              {j}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Corner peel, in px: how much is turned up at rest and under the cursor. */
const PEEL_REST = 20;
const PEEL_HOVER = 54;
// The cut runs along x + y = width + height - peel, so the sheet is gone once
// peel clears width + height. Comfortably past the largest note at any column
// count, which is what makes the click read as the note being peeled off.
const PEEL_AWAY = 1000;
/** How long the sheet takes to lift clear of the mat. */
const PEEL_AWAY_MS = 1000;
/** A beat after the peel lands before the tab opens, so the two don't collide.
 * Still far inside the click's 5s activation window, so no popup block. */
const OPEN_AFTER_MS = PEEL_AWAY_MS + 220;
/** The hover peel wants a snappy ease-out, but that curve spends 80% of its
 * time almost still — on the long peel it reads as a flick, then a wait. This
 * one is paced evenly, so the sheet actually looks like it is being pulled. */
const PEEL_AWAY_EASE = "cubic-bezier(0.5, 0.02, 0.35, 1)";

function StickyNote({ project, index }: { project: Project; index: number }) {
  const { play } = useSound();
  const [lifted, setLifted] = useState(false);
  const [peelingAway, setPeelingAway] = useState(false);
  const url = project.url;

  // One number drives both the cut and the flap that fills it, so the two can
  // never disagree mid-animation. A CSS transition rather than a spring: the
  // cut corner and the flap are separate properties on separate elements, and
  // a shared easing keeps them locked together frame for frame.
  const peel = peelingAway ? PEEL_AWAY : lifted ? PEEL_HOVER : PEEL_REST;
  const ease = peelingAway ? PEEL_AWAY_EASE : "cubic-bezier(0.22, 1, 0.36, 1)";
  const peelMs = peelingAway ? PEEL_AWAY_MS : 420;

  function handleClick(event: React.MouseEvent) {
    play("sticky");
    if (!url) return;
    // Cmd/ctrl/shift-click already open a tab or window themselves — let the
    // browser have those rather than swallowing them for the animation.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;

    event.preventDefault();
    setPeelingAway(true);
    window.setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      setPeelingAway(false);
    }, OPEN_AFTER_MS);
  }

  const note = (
    <article
      style={{
        // The corner is genuinely cut out of the sheet rather than covered by
        // a triangle of flat colour — that way the mat's grid and grain show
        // through the gap, which is what sells it as paper on a surface.
        clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${peel}px), calc(100% - ${peel}px) 100%, 0 100%)`,
        transition: `clip-path ${peelMs}ms ${ease}`,
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
      {/* The arrow is the only thing marking a note as clickable — without
            it a linked note and a plain one look identical until you hover. */}
      <p className="relative mb-5 font-mono text-[11px] uppercase tracking-widest opacity-60">
        Experiment {String(index + 1).padStart(2, "0")} — {project.type}
        {url ? <span aria-hidden> ↗</span> : null}
      </p>

      <h3 className="relative font-marker text-2xl font-bold leading-tight">
        {project.title}
      </h3>

      {project.metric && (
        <p className="relative mt-3 flex items-baseline gap-2">
          <span className="font-marker text-3xl font-semibold leading-none tracking-tight">
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
          transition: `width ${peelMs}ms ${ease}, height ${peelMs}ms ${ease}`,
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
  );

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
      // drop-shadow rather than box-shadow: box-shadow traces the element's
      // box, so it would draw a square corner over the cut-away one. The
      // filter follows the clipped silhouette instead.
      className={`relative transition-[filter] duration-300 ${
        lifted
          ? "[filter:drop-shadow(0_20px_24px_rgba(0,0,0,0.42))]"
          : "[filter:drop-shadow(0_10px_14px_rgba(0,0,0,0.34))]"
      }`}
    >
      {url ? (
        // A real anchor, so the URL previews on hover and cmd-click, middle
        // click and keyboard all behave the way a link should.
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block cursor-pointer"
        >
          {note}
        </a>
      ) : (
        <div onClick={handleClick}>{note}</div>
      )}
    </motion.div>
  );
}

export function Projects() {
  const [matRef, matBox] = useBoxSize<HTMLDivElement>();

  return (
    <section
      id="work"
      className="relative bg-chalk px-4 py-14 sm:px-8 sm:py-20 lg:px-12"
    >
      {/* the mat itself — inset from the viewport so it reads as a physical
          object lying on the page rather than a full-bleed background */}
      <div
        ref={matRef}
        className="relative overflow-hidden rounded-[26px] bg-mat-green px-6 py-24 shadow-[0_30px_70px_-30px_rgba(23,51,44,0.75)] sm:rounded-[40px] sm:px-10 lg:px-16"
      >
        {/* the printed surface: grid, four edge rulers, angle guides and the
            protractor, all measured against the mat's real box */}
        <MatPrint width={matBox.width} height={matBox.height} />
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
            Products &amp; Case Studies
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
