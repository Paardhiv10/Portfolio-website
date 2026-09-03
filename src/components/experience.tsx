"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { site } from "@/content/site";
import { useSound } from "@/lib/sound-context";

export function Experience() {
  const { play } = useSound();
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="experience"
      className="relative bg-chalk px-6 py-28 text-mirage sm:px-10 lg:px-16"
    >
      <div className="relative mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-jade"
        >
          Experience
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-5xl tracking-tight sm:text-6xl"
        >
          Career Log
        </motion.h2>

        {/* receipt — unrolls downward from the printer, with a paper rustle */}
        <motion.div
          initial={reduceMotion ? false : { scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          onViewportEnter={() => play("paper")}
          style={{ transformOrigin: "top center" }}
          className="mx-auto mt-16 max-w-2xl bg-white font-mono text-base shadow-[0_20px_60px_-20px_rgba(27,29,26,0.35)]"
        >
          <div
            aria-hidden
            className="h-3 w-full"
            style={{
              // The zigzag is the section showing *through* the torn edge, so
              // these triangles match the section background, not the receipt.
              backgroundImage:
                "linear-gradient(135deg, var(--color-chalk) 25%, transparent 25%), linear-gradient(225deg, var(--color-chalk) 25%, transparent 25%)",
              backgroundSize: "12px 12px",
              backgroundPosition: "0 0",
            }}
          />

          <div className="px-6 py-8 sm:px-10">
            <div className="mb-6 text-center">
              <p className="text-lg tracking-widest">PAARDHIV SARAKAM</p>
              <p className="mt-1 text-sm text-mirage/50">
                CAREER RECEIPT · {site.experience.length} ROLES · 2021 — PRESENT
              </p>
            </div>

            <div className="border-t border-dashed border-mirage/25" />

            {site.experience.map((job, i) => (
              <div key={job.company}>
                <div className="py-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="flex items-center gap-2 text-[17px] font-bold">
                      {job.logo && (
                        <span className="relative inline-block h-5 w-5 shrink-0">
                          <Image
                            src={job.logo}
                            alt=""
                            fill
                            className="object-contain"
                          />
                        </span>
                      )}
                      {job.company}
                    </span>
                    <span className="whitespace-nowrap text-sm text-mirage/50">
                      {job.dates}
                    </span>
                  </div>
                  <p className="mt-1 text-sm italic text-mirage/60">{job.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mirage/75">
                    {job.impact}
                  </p>
                </div>
                {i < site.experience.length - 1 && (
                  <div className="border-t border-dashed border-mirage/25" />
                )}
              </div>
            ))}

            <div className="border-t border-dashed border-mirage/25 pt-4">
              <div className="flex items-baseline justify-between text-lg font-bold">
                <span>YOE (FTE+INTERN)</span>
                <span>4+ YEARS</span>
              </div>
              <p className="mt-4 text-center text-[13px] text-mirage/40">
                *** THANK YOU FOR SCROLLING ***
              </p>
            </div>
          </div>

          <div
            aria-hidden
            className="h-3 w-full"
            style={{
              // Mirrored angles (45°/315°) put the chalk in the bottom corners so
              // the tear reaches the element's bottom edge, unlike the top edge.
              backgroundImage:
                "linear-gradient(45deg, var(--color-chalk) 25%, transparent 25%), linear-gradient(315deg, var(--color-chalk) 25%, transparent 25%)",
              backgroundSize: "12px 12px",
              backgroundPosition: "0 0",
            }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-10 max-w-xl text-center font-serif text-xl leading-snug text-mirage/70 sm:text-2xl"
        >
          {site.experienceNote}
        </motion.p>
      </div>
    </section>
  );
}
