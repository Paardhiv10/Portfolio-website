"use client";

import { motion, useReducedMotion } from "motion/react";
import { AsciiPortrait } from "@/components/ascii-portrait";
import { GrainOverlay } from "@/components/grain-overlay";
import { ScrambleText } from "@/components/scramble-text";
import { site } from "@/content/site";

// Word boundaries, not lookbehind — older Safari throws on lookbehind.
const HIGHLIGHT_RE = new RegExp(
  `\\b(${site.hero.highlights
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "g",
);

// `as const` narrows to literals, which would reject a plain string lookup.
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

      {/* min-height mirrors pt-28, so the portrait ends flush with the fold. */}
      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-6xl flex-col justify-end xl:justify-center">
        {/* One measure for heading and paragraphs, so the block reads as one box. */}
        <div className="max-w-xl">
          <motion.h1
            {...fadeUp(0)}
            // Only a little larger than the body: it opens the paragraph, not shouts over it.
            className="font-display text-[min(9vw,2.25rem)] leading-tight tracking-tight sm:text-4xl"
          >
            <ScrambleText text={site.hero.greeting} />
          </motion.h1>

          {/* Justified from sm up; a phone measure is too narrow to set without gaps. */}
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

        {/* ASCII portrait: in flow on phones, standing on the fold from xl up. */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          // Centres the <pre> below xl; it has an intrinsic width and would hug left.
          className="mx-auto mt-10 flex w-full max-w-[500px] justify-center xl:absolute xl:right-[calc(2rem-(100vw-100%)/2)] xl:bottom-0 xl:mx-0 xl:mt-0 xl:block xl:w-auto xl:max-w-none"
        >
          <AsciiPortrait />
        </motion.div>
      </div>
    </section>
  );
}
