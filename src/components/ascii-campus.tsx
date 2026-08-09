"use client";

import { motion, useReducedMotion } from "motion/react";
import campus from "@/content/ascii-campus.json";

export function AsciiCampus() {
  const reduceMotion = useReducedMotion();

  return (
    <pre
      aria-label="ASCII rendering of the campus amphitheatre"
      role="img"
      // Sized against the column (cqw), not the viewport, so the grid — 140
      // glyphs at ~0.62em each — always lands just inside its slot instead of
      // spilling into the gutter at some breakpoints.
      //
      // leading-[0.85] is load-bearing, not styling: the art is generated for
      // a 0.73 cell aspect, and default leading would stretch it vertically.
      // Bold because dark-on-light glyphs read thinner than the light-on-dark
      // original.
      // The clamp floor is deliberately below anything legible: 1.14cqw is the
      // size that exactly fits, so any floor above it makes the art overflow
      // its column on narrow phones rather than merely render small.
      className="select-none font-mono font-bold text-ink leading-[0.85] tracking-[0.02em] text-[clamp(3px,1.14cqw,13px)]"
    >
      {campus.lines.map((line, i) => (
        <motion.span
          key={i}
          initial={reduceMotion ? false : { opacity: 0, x: 8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 0.5, delay: i * 0.014, ease: "easeOut" }
          }
          className="block"
        >
          {line}
          {"\n"}
        </motion.span>
      ))}
    </pre>
  );
}
