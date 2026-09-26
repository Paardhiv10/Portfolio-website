"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import Image from "next/image";
import { AmbientFog, HiddenClouds } from "@/components/fog";
import { GrainOverlay } from "@/components/grain-overlay";
import { site } from "@/content/site";
import { useSound } from "@/lib/sound-context";

/** Aged-paper fill used by the tickets. */
const PAPER = "#efe3cd";

/**
 * Postage perforation, punched with a mask rather than drawn.
 *
 * Four tiled radial-gradient layers — one per edge — each a strip carrying a
 * transparent circle, composited with `intersect` so the holes accumulate
 * instead of the strips cancelling each other out. `r` is the hole radius and
 * `pitch` the centre-to-centre spacing, so `pitch - 2r` is the paper left
 * between holes; keep that positive or the edge tears clean off.
 */
function perforation(r: number, pitch: number, corner: number) {
  const hole = (at: string) =>
    `radial-gradient(${r}px at ${at}, #0000 98%, #000)`;
  const guard = "linear-gradient(#000, #000)";

  // Eight layers, in two groups.
  //
  // The four hole layers each tile one edge, anchored to the corner rather than
  // centred, and composited with `intersect` so the punches accumulate. `round`
  // scales the tile so a whole number fits the edge exactly — without it the
  // grid can land mid-hole against a corner and slice one into a spike.
  //
  // The four guard layers are opaque squares pinned to each corner, composited
  // with `add` so they run *after* the punching and restore solid paper. That
  // decouples corner thickness from hole spacing: with the hole centred in its
  // tile the corner would otherwise always be `pitch/2 - r`, so a chunkier
  // corner would force the holes apart. Size `corner` to fully swallow the
  // first hole (which ends at `pitch/2 + r`) — a guard that stops partway
  // through one leaves a sliver of hole behind, which looks like damage.
  const image = [
    guard,
    guard,
    guard,
    guard,
    hole("50% 0"), // top
    hole("50% 100%"), // bottom
    hole("0 50%"), // left
    hole("100% 50%"), // right
  ].join(", ");
  const size = [
    `${corner}px ${corner}px`,
    `${corner}px ${corner}px`,
    `${corner}px ${corner}px`,
    `${corner}px ${corner}px`,
    `${pitch}px 100%`,
    `${pitch}px 100%`,
    `100% ${pitch}px`,
    `100% ${pitch}px`,
  ].join(", ");
  const position = [
    "0 0",
    "100% 0",
    "0 100%",
    "100% 100%",
    "0 0",
    "0 0",
    "0 0",
    "0 0",
  ].join(", ");
  const repeat = [
    "no-repeat",
    "no-repeat",
    "no-repeat",
    "no-repeat",
    "round no-repeat",
    "round no-repeat",
    "no-repeat round",
    "no-repeat round",
  ].join(", ");
  const composite =
    "add, add, add, add, intersect, intersect, intersect, intersect";
  const webkitComposite =
    "source-over, source-over, source-over, source-over, source-in, source-in, source-in, source-in";

  return {
    maskImage: image,
    maskSize: size,
    maskPosition: position,
    maskRepeat: repeat,
    maskComposite: composite,
    WebkitMaskImage: image,
    WebkitMaskSize: size,
    WebkitMaskPosition: position,
    WebkitMaskRepeat: repeat,
    WebkitMaskComposite: webkitComposite,
  } as const;
}

/** Falcon carrying a wax-sealed letter — the stamp's engraving. */
function CarrierFalcon() {
  return (
    <Image
      src="/footer/falcon.png"
      alt="Send email"
      width={1536}
      height={1024}
      sizes="340px"
      className="h-auto w-full"
    />
  );
}

/** Cancellation mark, struck across the engraving the way a real one lands. */
function Postmark() {
  return (
    <svg
      viewBox="0 0 130 130"
      aria-hidden
      className="h-full w-full text-chalk"
      fill="none"
    >
      <circle cx="58" cy="65" r="46" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" />
      <circle
        cx="58"
        cy="65"
        r="38"
        stroke="currentColor"
        strokeOpacity="0.32"
        strokeWidth="1"
        strokeDasharray="4 5"
      />
      <g
        fill="currentColor"
        fillOpacity="0.55"
        fontFamily="ui-monospace, monospace"
        textAnchor="middle"
      >
        <text x="58" y="56" fontSize="12" letterSpacing="2">
          SEND
        </text>
        <text x="58" y="72" fontSize="12" letterSpacing="2">
          WORD
        </text>
        <text x="58" y="90" fontSize="8" letterSpacing="1.5">
          INDIA
        </text>
      </g>
      {/* the wavy tail every cancellation drags behind it */}
      <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round">
        <path d="M104 52 Q114 58 124 52" />
        <path d="M104 65 Q114 71 124 65" />
        <path d="M104 78 Q114 84 124 78" />
      </g>
    </svg>
  );
}

/**
 * A cloakroom ticket. The two notches are punched by intersecting radial
 * gradients in the mask, and the dashed tear line sits at the same height so
 * the stub reads as genuinely detachable.
 */
function Ticket({
  label,
  handle,
  href,
  onHover,
  onClick,
}: {
  label: string;
  handle: string;
  href: string;
  onHover: () => void;
  onClick: () => void;
}) {
  const notch =
    "radial-gradient(circle at 0 58%, transparent 7px, black 7.5px), radial-gradient(circle at 100% 58%, transparent 7px, black 7.5px)";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={onHover}
      onClick={onClick}
      whileHover={{ y: -12, rotate: 0, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative block w-full text-mirage sm:w-[150px]"
      style={{
        background: PAPER,
        maskImage: notch,
        WebkitMaskImage: notch,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
        boxShadow: "0 14px 34px rgba(0,0,0,0.45)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-2 top-2 bottom-[46%] border border-dashed border-mirage/25"
      />

      <div className="relative px-2 pt-4 pb-3.5 text-center sm:px-3 sm:pt-5 sm:pb-4">
        <span className="block font-display text-[15px] leading-none tracking-tight sm:text-xl lg:text-2xl">
          {label}
        </span>
        <span className="mt-1.5 block font-mono text-[10px] text-mirage/55 sm:text-[11px]">
          {handle}
        </span>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[58%] border-t border-dashed border-mirage/40"
      />

      {/* The stub carries no text, but it still has to be tall enough to sit
          below the 58% tear line — collapse it and the dashed line lands in
          the middle of nothing and the ticket stops reading as one. */}
      <div aria-hidden className="h-[34px] sm:h-[42px]" />
    </motion.a>
  );
}

export function SiteFooter() {
  const { play } = useSound();

  // Motion values rather than state: the pointer moves every frame, and a
  // setState per move would re-render the whole footer each time. These feed
  // straight into the mask string without React touching the tree.
  const mx = useMotionValue(-800);
  const my = useMotionValue(-800);
  const revealMask = useMotionTemplate`radial-gradient(280px circle at ${mx}px ${my}px, #000 0%, rgba(0,0,0,0.7) 42%, transparent 72%)`;

  const socials = [
    { label: "GitHub", handle: "/code", href: site.social.github },
    { label: "LinkedIn", handle: "/work", href: site.social.linkedin },
    { label: "X", handle: "/thoughts", href: site.social.twitter },
  ];

  const rise = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
  };

  return (
    // The footer's outer element only supplies the margin around the stamp and
    // the headroom the tickets need to stick up out of it.
    <footer
      id="footer"
      className="bg-chalk px-3 pt-24 pb-3 sm:px-5 sm:pt-28 sm:pb-5 lg:px-8 lg:pb-8"
    >
      <div className="relative mx-auto max-w-6xl">
        {/* the tickets, tucked in behind the stamp's top edge — z-0 here, and
            the stamp pulls up over them with a negative margin */}
        <div className="relative z-0 flex justify-center px-2 sm:justify-start sm:pl-10 lg:pl-20">
          <div className="flex w-full items-end gap-2.5 sm:w-auto sm:gap-0 sm:-space-x-5">
            {socials.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 26, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: [-6, 2.5, -3][i] }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: 0.12 + i * 0.09 }}
                style={{ zIndex: i }}
                className="origin-bottom min-w-0 flex-1 sm:flex-none"
              >
                <Ticket
                  {...s}
                  onHover={() => play("hover")}
                  onClick={() => play("click")}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── the stamp ─────────────────────────────────────────────────────
            data-nav-dark is what tells Nav to flip to its light-on-dark
            treatment while this panel is under it. No border radius: the
            perforation is the edge treatment, and rounded corners would fight
            it. */}
        <div
          data-nav-dark
          // Overlap is tuned against the ticket's 58% tear line: cut deeper
          // than ~52px and the notches and stub disappear behind the edge,
          // leaving what looks like a plain card rather than a ticket.
          className="relative z-10 -mt-3 bg-ink px-6 pt-16 pb-9 text-chalk sm:-mt-12 sm:px-10 sm:pt-20 sm:pb-10 lg:px-16"
          // 18px holes on a 32px pitch: a 14px paper bridge between them. Tried
          // 24 (holes almost touching — reads as a scalloped wave rather than
          // perforation) and 40 (bridges so wide it reads as decorative
          // scallops); 32 is the one that reads as torn from a sheet.
          // The 32px guard swallows the first hole on each edge, so the corner
          // keeps ~39px of solid paper instead of 7px.
          style={perforation(9, 32, 32)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set(e.clientX - r.left);
            my.set(e.clientY - r.top);
          }}
          onMouseLeave={() => {
            mx.set(-800);
            my.set(-800);
          }}
        >
          <GrainOverlay opacity={0.05} />

          {/* the bank that always hangs around the falcon */}
          <AmbientFog />

          {/* the same sky, denser — masked down to a disc the cursor drags
              around, so moving over the stamp wipes cloud into view */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              maskImage: revealMask,
              WebkitMaskImage: revealMask,
            }}
          >
            <HiddenClouds />
          </motion.div>

          <div className="relative z-10 flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-md">
              <motion.p
                {...rise}
                transition={{ duration: 0.5 }}
                className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-orange"
              >
                Get in Touch
              </motion.p>
              <motion.h2
                {...rise}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="font-display text-4xl tracking-tight sm:text-5xl"
              >
                Send Word
              </motion.h2>
              <motion.p
                {...rise}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-4 text-lg leading-[1.5] text-chalk/45"
              >
                Sending an email via Peregrine Falcon is the fastest way to get
                to me.
              </motion.p>

              <motion.a
                href={`mailto:${site.email}`}
                onMouseEnter={() => play("hover")}
                onClick={() => play("click")}
                {...rise}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="group mt-7 inline-flex items-center gap-2 border-b border-chalk/25 pb-1 font-mono text-xs text-chalk/60 transition-colors hover:border-orange hover:text-orange"
              >
                <span aria-hidden>&rarr;</span>
                {site.email}
              </motion.a>
            </div>

            {/* the engraving */}
            <motion.a
              href={`mailto:${site.email}`}
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
              aria-label={`Email ${site.email}`}
              {...rise}
              transition={{ duration: 0.55, delay: 0.12 }}
              whileHover={{ x: 8, y: -8 }}
              className="relative block w-[240px] shrink-0 self-center sm:w-[310px] lg:w-[340px]"
            >
              <CarrierFalcon />
              <span className="pointer-events-none absolute -top-2 -left-4 h-[120px] w-[120px] -rotate-12 sm:-left-8 sm:h-[150px] sm:w-[150px]">
                <Postmark />
              </span>
            </motion.a>
          </div>

          {/* the stamp's caption line */}
          <div className="relative z-10 mt-10 flex flex-col items-center gap-2 border-t border-chalk/15 pt-6 text-center font-mono text-[11px] text-chalk/40 sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} Paardhiv Sarakam.</p>
            <p>Built with too many small decisions.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
