"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import type { ComponentType } from "react";
import { GrainOverlay } from "@/components/grain-overlay";
import {
  RubiksCube,
  Rocket,
  Shuttlecock,
  Sneaker,
  TailFin,
  Vinyl,
} from "@/components/interest-figures";
import { useSound } from "@/lib/sound-context";

/**
 * Each interest renders a real photographed object when one is available, and
 * falls back to its drawn figure otherwise.
 *
 * To swap in a real object: drop a background-removed PNG at the `photo` path
 * below and change that entry from `null` to the path. Square-ish crops work
 * best — the figure box is square and the art is centred inside it. Nothing
 * else needs changing; the hover scale and the sentence flow are identical
 * either way.
 */
type Interest = {
  fallback: ComponentType;
  photo: string | null;
  label: string;
  /** Where clicking the object goes. External links open in a new tab. */
  href?: string;
  /** Where that link lands, for the screen-reader label. */
  destination?: string;
};

const INTERESTS = {
  vinyl: {
    fallback: Vinyl,
    // expected: /public/interests/vinyl.png
    photo: null,
    label: "A vinyl record",
    href: "/music",
    destination: "my record crate",
  },
  rocket: {
    fallback: Rocket,
    // expected: /public/interests/startups.png
    photo: null,
    label: "A rocket",
  },
  cube: {
    fallback: RubiksCube,
    // expected: /public/interests/cube.png
    photo: null,
    label: "A Rubik's Cube",
    href: "https://www.worldcubeassociation.org/persons/2016PAAR01",
    destination: "my World Cube Association profile",
  },
  sneaker: {
    fallback: Sneaker,
    // expected: /public/interests/sneaker.png
    photo: null,
    label: "A sneaker",
    href: "/sneakers",
    destination: "my sneaker shelf",
  },
  shuttlecock: {
    fallback: Shuttlecock,
    // expected: /public/interests/shuttlecock.png
    photo: null,
    label: "A shuttlecock",
  },
  tailfin: {
    fallback: TailFin,
    // expected: /public/interests/tailfin.png
    photo: null,
    label: "An aircraft tail fin",
    href: "/travel",
    destination: "the tail fins I've flown behind",
  },
} satisfies Record<string, Interest>;

/**
 * One cut-out sitting inline in the sentence. The parent drives a "hover"
 * variant that both scales this up and cues the figure's own animation — the
 * variant name propagates down to the SVG's motion children automatically.
 */
function Figure({ kind }: { kind: keyof typeof INTERESTS }) {
  const reduceMotion = useReducedMotion();
  const { play } = useSound();
  const { fallback: Art, photo, label, href, destination } =
    INTERESTS[kind] as Interest;

  const art = photo ? (
    <Image
      src={photo}
      alt=""
      fill
      sizes="120px"
      className="object-contain"
      // The cut-outs are transparent, so a photo needs the same drop of
      // shadow the drawn figures get from their outlines to sit on the page.
      style={{ filter: "drop-shadow(0 2px 3px rgba(27,29,26,0.22))" }}
    />
  ) : (
    <Art />
  );

  const external = href?.startsWith("http");

  // A linked object is a real anchor rather than a span with a click handler,
  // so it keeps middle-click, cmd-click and keyboard focus for free.
  const Tag = href ? motion.a : motion.span;

  return (
    <Tag
      {...(href
        ? {
            href,
            "aria-label": `${label} — opens ${destination ?? "another page"}`,
            ...(external ? { target: "_blank", rel: "noreferrer" } : {}),
          }
        : // No href: decoration, not a control. Leaving it focusable put two
          // dead stops in the tab order that looked clickable and did nothing.
          { role: "img", "aria-label": label })}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      onHoverStart={() => play("hover")}
      onClick={() => href && play("click")}
      variants={{
        rest: { scale: 1, zIndex: 0 },
        hover: { scale: reduceMotion ? 1.05 : 2.5, zIndex: 40 },
      }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
      // align-[-0.22em] drops it onto the text baseline; the figures are square
      // and sized in em so they track the heading's responsive font size.
      className={`relative mx-[0.22em] inline-block h-[1.15em] w-[1.15em] align-[-0.22em] outline-none ${
        href ? "cursor-pointer" : ""
      }`}
    >
      {art}
    </Tag>
  );
}

export function Interests() {
  const fadeUp = {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
  };

  return (
    // No overflow-hidden anywhere up this tree: the figures grow past their
    // inline box on hover and must be free to spill over the lines around them.
    <section
      id="interests"
      className="relative bg-chalk px-6 py-24 text-mirage sm:px-10 sm:py-32 lg:px-16"
    >
      <GrainOverlay opacity={0.05} />

      <div className="relative mx-auto max-w-4xl">
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-orange"
        >
          Off the clock
        </motion.p>

        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-5xl tracking-tight sm:text-6xl"
        >
          Interests
        </motion.h2>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.55, delay: 0.12 }}
          // Generous leading is load-bearing here — it's the room the figures
          // grow into so an enlarged one never collides with the line above.
          className="mt-12 font-display text-[1.6rem] leading-[1.85] tracking-tight sm:text-[2.1rem] sm:leading-[1.8]"
        >
          I listen to <Figure kind="vinyl" /> far more music than is strictly
          reasonable, read everything I can find about <Figure kind="rocket" />{" "}
          startups, count myself a proper <Figure kind="cube" /> cuber, keep more{" "}
          <Figure kind="sneaker" /> sneakers than my shelves can honestly hold,
          play <Figure kind="shuttlecock" /> badminton whenever a court is free,
          and get on a <Figure kind="tailfin" /> plane whenever I can find a
          reason to.
        </motion.p>
      </div>
    </section>
  );
}
