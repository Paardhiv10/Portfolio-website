"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { site } from "@/content/site";
import { useSound } from "@/lib/sound-context";

// Solid poster panels, cycled across the four groups.
const PANEL = ["bg-aqua", "bg-orange", "bg-chalk", "bg-aqua"];

/** Ornamental dot column that runs down the right edge of each panel. */
function DotStrip() {
  return (
    <span
      aria-hidden
      className="absolute inset-y-0 right-0 w-14"
      style={{
        backgroundImage:
          "radial-gradient(rgba(27,29,26,0.28) 2.5px, transparent 2.6px)",
        backgroundSize: "14px 14px",
        maskImage: "linear-gradient(to right, transparent, black 55%)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 55%)",
      }}
    />
  );
}

export function Algorithm() {
  const { play } = useSound();
  const arrowRef = useRef<HTMLDivElement>(null);

  // Scroll-linked so the arrow literally draws itself as you come down
  // the page, rather than firing once on enter.
  const { scrollYProgress } = useScroll({
    target: arrowRef,
    offset: ["start 0.9", "center 0.55"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const headOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  return (
    <section
      id="algorithm"
      data-nav-dark
      className="relative overflow-hidden bg-black px-6 py-28 text-chalk sm:px-10 lg:px-16"
    >
      {/* tiled backdrop, echoing the patterned field behind a poster */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(232,235,243,0.11) 2px, transparent 2.1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-orange"
        >
          Skills
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-5xl tracking-tight sm:text-6xl"
        >
          The Algorithm
        </motion.h2>

        <div
          ref={arrowRef}
          className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-[400px_72px_1fr] lg:gap-0"
        >
          {/* venn — no panel, but it borrows the cards' serif title, tight
              tracking and dot ornament so it still reads as one of the family */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <svg
              viewBox="0 0 300 280"
              className="mx-auto w-full max-w-[400px]"
              role="img"
              aria-label="Shape the product, ship the product, and sync the people overlap to create impact"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-chalk/30"
              >
                <circle cx="105" cy="98" r="90" />
                <circle cx="195" cy="98" r="90" />
                <circle cx="150" cy="174" r="90" />
              </g>

              <g className="fill-chalk" textAnchor="middle">
                <text x="58" y="74" fontSize="15" fontWeight="700">
                  Shape
                </text>
                <text x="58" y="92" fontSize="13" className="fill-chalk/65">
                  the product
                </text>

                <text x="242" y="74" fontSize="15" fontWeight="700">
                  Ship
                </text>
                <text x="242" y="92" fontSize="13" className="fill-chalk/65">
                  the product
                </text>

                <text x="150" y="212" fontSize="15" fontWeight="700">
                  Sync
                </text>
                <text x="150" y="230" fontSize="14" className="fill-chalk/65">
                  the people
                </text>
              </g>

              {/* impact point, sitting in the true three-way overlap */}
              <circle cx="150" cy="128" r="4.5" className="fill-orange" />
              <text
                x="150"
                y="146"
                textAnchor="middle"
                fontSize="9"
                letterSpacing="1.5"
                className="fill-orange font-mono"
              >
                IMPACT
              </text>
            </svg>

          </motion.div>

          {/* horizontal arrow into the cards (desktop) */}
          <svg
            viewBox="0 0 88 24"
            className="hidden h-6 w-full lg:block"
            aria-hidden
          >
            <motion.path
              d="M2 12 H74"
              fill="none"
              stroke="var(--color-orange)"
              strokeWidth="1.5"
              strokeDasharray="5 5"
              style={{ pathLength }}
            />
            <motion.path
              d="M68 5 L79 12 L68 19"
              fill="none"
              stroke="var(--color-orange)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: headOpacity }}
            />
          </svg>

          {/* vertical arrow into the cards (mobile) */}
          <svg
            viewBox="0 0 24 72"
            className="mx-auto h-16 w-6 lg:hidden"
            aria-hidden
          >
            <motion.path
              d="M12 2 V58"
              fill="none"
              stroke="var(--color-orange)"
              strokeWidth="1.5"
              strokeDasharray="5 5"
              style={{ pathLength }}
            />
            <motion.path
              d="M5 52 L12 63 L19 52"
              fill="none"
              stroke="var(--color-orange)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: headOpacity }}
            />
          </svg>

          {/* poster cards */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="mb-6 font-serif text-3xl tracking-tight sm:text-4xl"
            >
              To achieve the <span className="text-aqua">Impact</span>
            </motion.p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {site.algorithm.groups.map((group, i) => (
                <motion.article
                  key={group.title + group.highlight}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  onMouseEnter={() => play("hover")}
                  className={`relative flex min-h-[190px] flex-col justify-between overflow-hidden p-5 text-mirage transition-transform hover:-translate-y-1 ${PANEL[i % PANEL.length]}`}
                >
                  <DotStrip />
                  <h3 className="relative max-w-[78%] font-serif text-[1.5rem] leading-[1.1] tracking-tight">
                    {group.title} {group.highlight}
                  </h3>
                  <p className="relative mt-6 max-w-[80%] text-[15px] leading-relaxed text-mirage/75">
                    {group.skills.join(", ")}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
