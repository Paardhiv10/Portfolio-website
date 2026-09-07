"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { GrainOverlay } from "@/components/grain-overlay";
import { site } from "@/content/site";
import { useSound } from "@/lib/sound-context";

// Keyed off the data's union, so a fourth colour is a type error here.
const CARD_BG: Record<(typeof site.projects)[number]["color"], string> = {
  canary: "bg-canary text-mirage",
  aqua: "bg-aqua text-mirage",
  orange: "bg-orange text-mirage",
};

type Project = (typeof site.projects)[number];

// 60 units wide at any size, in real pixels — a stretched viewBox would skew it.
const MAT_UNITS_W = 60;
/** Gap between the mat's edge and the ruled area, where the rulers sit. */
const MAT_INSET = 34;
const MAT_ARC_UNITS = 10;
const MAT_ANGLES = [15, 30, 45, 60];
// Faint on purpose: the heading and intro sit on the mat, not on a note.
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
// The cut is x + y = w + h - peel, so the sheet clears once peel passes both.
const PEEL_AWAY = 1000;
/** How long the sheet takes to lift clear of the mat. */
const PEEL_AWAY_MS = 1000;
/** A beat after the peel, still inside the click's activation window. */
const OPEN_AFTER_MS = PEEL_AWAY_MS + 220;
/** Evenly paced: the hover ease-out would read as a flick, then a wait. */
const PEEL_AWAY_EASE = "cubic-bezier(0.5, 0.02, 0.35, 1)";

function StickyNote({ project, index }: { project: Project; index: number }) {
  const { play } = useSound();
  const [lifted, setLifted] = useState(false);
  const [peelingAway, setPeelingAway] = useState(false);
  const url = project.url;

  // One number drives cut and flap, so they cannot disagree mid-animation.
  const peel = peelingAway ? PEEL_AWAY : lifted ? PEEL_HOVER : PEEL_REST;
  const ease = peelingAway ? PEEL_AWAY_EASE : "cubic-bezier(0.22, 1, 0.36, 1)";
  const peelMs = peelingAway ? PEEL_AWAY_MS : 420;

  function handleClick(event: React.MouseEvent) {
    play("sticky");
    if (!url) return;
    // Let modifier-clicks through; they already do the right thing.
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
        // Genuinely cut out, so the mat shows through — that is what sells the paper.
        clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${peel}px), calc(100% - ${peel}px) 100%, 0 100%)`,
        transition: `clip-path ${peelMs}ms ${ease}`,
      }}
      className={`relative overflow-hidden p-7 ${CARD_BG[project.color]}`}
    >
      <GrainOverlay opacity={0.09} />

      {/* Adhesive strip: the band at the top of a pad where glue darkens the paper. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.10), rgba(0,0,0,0.03) 60%, transparent)",
        }}
      />

      {/* The paper's own shading, lit top-left and dropping off at the peel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.20), transparent 40%, rgba(0,0,0,0.10))",
        }}
      />

      {/* The arrow is the only cue that a note is clickable before you hover. */}
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

      {/* The turned-up flap: shadowed at the crease, catching light at the tip. */}
      <div
        aria-hidden
        style={{
          width: peel,
          height: peel,
          transition: `width ${peelMs}ms ${ease}, height ${peelMs}ms ${ease}`,
        }}
        className="pointer-events-none absolute bottom-0 right-0"
      >
        {/* The fold maps onto the box's top-left half; the clip-path cut the rest. */}
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
      // drop-shadow, not box-shadow, which would square off the cut corner.
      className={`relative transition-[filter] duration-300 ${
        lifted
          ? "[filter:drop-shadow(0_20px_24px_rgba(0,0,0,0.42))]"
          : "[filter:drop-shadow(0_10px_14px_rgba(0,0,0,0.34))]"
      }`}
    >
      {url ? (
        // A real anchor, so hover preview, cmd-click and keyboard all behave.
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
      {/* The mat, inset so it reads as an object on the page, not a background. */}
      <div
        ref={matRef}
        className="relative overflow-hidden rounded-[26px] bg-mat-green px-6 py-24 shadow-[0_30px_70px_-30px_rgba(23,51,44,0.75)] sm:rounded-[40px] sm:px-10 lg:px-16"
      >
        {/* The printed surface: grid, rulers, angle guides and protractor. */}
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
        {/* Soft bevel, so the rounded corners read as thick rubber. */}
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
            The Workbench
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            // Only this line needs it; at 18px a printed rule cuts through the letters.
            style={{
              backgroundImage:
                "radial-gradient(ellipse 58% 62% at 34% 50%, rgba(23,51,44,0.62) 0%, rgba(23,51,44,0) 74%)",
            }}
            // py-2 gives the gradient room; the margin gives those 8px back.
            className="mt-1 -mb-2 max-w-xl py-2 text-lg leading-relaxed text-chalk/85"
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
