"use client";

import { motion, useReducedMotion } from "motion/react";
import { AsciiPortrait } from "@/components/ascii-portrait";
import { GrainOverlay } from "@/components/grain-overlay";
import { ScrambleText } from "@/components/scramble-text";
import { site } from "@/content/site";

// \b on both ends so `product` can't match inside `production`. Plain word
// boundaries rather than lookbehind: a lookbehind is a syntax error in older
// Safari, which would throw here at module scope and take the page with it.
const HIGHLIGHT_RE = new RegExp(
  `\\b(${site.hero.highlights
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "g",
);

// `as const` narrows the array to its literal members, which would reject a
// plain string lookup below.
const HIGHLIGHTS: readonly string[] = site.hero.highlights;

/** Splits a paragraph so the crucial phrases can carry the accent underline. */
function withHighlights(text: string) {
  return text.split(HIGHLIGHT_RE).map((part, i) =>
    HIGHLIGHTS.includes(part) ? (
      <span
        key={`${part}-${i}`}
        className="text-mirage underline decoration-orange/70 decoration-1 underline-offset-[5px]"
      >
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: "easeOut" as const },
        };

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-cream px-6 pt-28 pb-0 text-mirage sm:px-10 lg:px-16"
    >
      <GrainOverlay opacity={0.045} />

      {/* min-height mirrors the section's pt-28 exactly, and there is no
          bottom padding, so the portrait ends flush with the fold at every
          breakpoint — stacked on mobile, anchored right from xl up.
          justify-end below xl is what keeps it flush: the portrait is in flow
          there, and centring would split the leftover space above AND below
          it, floating it off the section's bottom edge. From xl the portrait
          is absolutely positioned at bottom-0, so it leaves the flow entirely
          and the text block goes back to being vertically centred. */}
      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-6xl flex-col justify-end xl:justify-center">
        {/* text — one column, one measure. The heading and every paragraph
            share `max-w-xl` so the block reads as a single justified-looking
            box rather than a heading with a narrower column hanging off it. */}
        <div className="max-w-xl">
          <motion.h1
            {...fadeUp(0)}
            // Only a little larger than the body: the reference the copy is
            // modelled on keeps the whole block near one size, so the greeting
            // opens the paragraph rather than shouting over it.
            className="font-display text-[min(9vw,2.25rem)] leading-tight tracking-tight sm:text-4xl"
          >
            <ScrambleText text={site.hero.greeting} />
          </motion.h1>

          {/* Justified with hyphenation so every line but the last reaches the
              same right edge — that ragged edge is what read as empty space.
              Only justify from sm up: on a phone the measure is too narrow to
              set without opening gaps between words. */}
          <div className="mt-8 space-y-5">
            {site.hero.bio.map((para, i) => (
              <motion.p
                key={para}
                {...fadeUp(0.16 + i * 0.06)}
                className="hyphens-auto text-pretty text-[17px] leading-[1.65] text-mirage/75 sm:text-justify sm:text-lg"
              >
                {withHighlights(para)}
              </motion.p>
            ))}
          </div>
        </div>

        {/* ascii portrait — in flow on small screens; on desktop it stands on
            the bottom edge of the fold, anchored to the right of the grid */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          // flex+justify-center centres the <pre> itself below xl — it has an
          // intrinsic width from its font-size, so without this it hugs the
          // left of the wrapper and leaves a lopsided gap on the right
          className="mx-auto mt-10 flex w-full max-w-[500px] justify-center xl:absolute xl:right-[calc(2rem-(100vw-100%)/2)] xl:bottom-0 xl:mx-0 xl:mt-0 xl:block xl:w-auto xl:max-w-none"
        >
          <AsciiPortrait />
        </motion.div>
      </div>
    </section>
  );
}
