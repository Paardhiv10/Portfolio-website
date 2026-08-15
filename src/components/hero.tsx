"use client";

import { motion, useReducedMotion } from "motion/react";
import { AsciiPortrait } from "@/components/ascii-portrait";
import { GrainOverlay } from "@/components/grain-overlay";
import { ScrambleText } from "@/components/scramble-text";
import { site } from "@/content/site";
import { useSound } from "@/lib/sound-context";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { play } = useSound();

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
          breakpoint — stacked on mobile, anchored right from xl up */}
      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-6xl flex-col justify-center">
        {/* text */}
        <div className="max-w-xl">
          <motion.p
            {...fadeUp(0)}
            className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-orange sm:mb-6 sm:tracking-[0.25em]"
          >
            {site.hero.eyebrow}
          </motion.p>

          <motion.h1
            {...fadeUp(0.08)}
            // 0.92 leading suited Instrument Serif's compact vertical metrics.
            // Source Serif 4 has far taller ascenders and deeper descenders, so
            // the two-line mobile wrap needs real leading. The min() cap keeps
            // the name off the right edge as the viewport approaches the sm
            // breakpoint, where text-6xl (60px) takes over seamlessly.
            className="font-display text-[min(12.5vw,3.75rem)] leading-[1.04] tracking-tight sm:text-6xl sm:leading-[0.95] lg:text-7xl"
          >
            <ScrambleText text={site.name} />
          </motion.h1>

          <motion.p
            {...fadeUp(0.18)}
            className="mt-7 max-w-md text-lg leading-[1.5] text-mirage/75 sm:mt-6"
          >
            {site.hero.bio}
          </motion.p>

          <motion.div
            {...fadeUp(0.28)}
            className="mt-6 flex items-start gap-2.5 font-mono text-xs leading-relaxed text-mirage/55"
          >
            {/* shrink-0 keeps the dot round — as a flex child it otherwise gets
                squashed into an oval once the tag wraps to two lines */}
            <span className="mt-[0.42em] inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-orange" />
            {site.hero.tag}
          </motion.div>

          <motion.div {...fadeUp(0.36)} className="mt-10 flex flex-wrap gap-4">
            <a
              href={site.resumeHref}
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
              className="rounded-full bg-orange px-6 py-3 font-mono text-xs uppercase tracking-widest text-chalk transition-transform hover:-translate-y-0.5"
            >
              Download Resume
            </a>
            <a
              href="#footer"
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
              className="rounded-full border border-mirage/30 px-6 py-3 font-mono text-xs uppercase tracking-widest text-mirage transition-colors hover:border-orange hover:text-orange"
            >
              Get in Touch
            </a>
          </motion.div>
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
