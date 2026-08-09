"use client";

import { motion, useReducedMotion } from "motion/react";
import portrait from "@/content/ascii-portrait.json";

export function AsciiPortrait() {
  const reduceMotion = useReducedMotion();

  return (
    <pre
      aria-label="ASCII portrait of Paardhiv Sarakam"
      role="img"
      // Two sizing regimes: stacked in flow below xl (sized against the
      // narrow column), and much larger from xl up where it stands in the
      // right half of the fold. Bold because dark-on-light glyphs read
      // thinner than the light-on-dark original.
      className="select-none font-mono font-bold text-orange-deep leading-[1.05] tracking-[0.02em] text-[clamp(3.5px,1.45vw,8px)] xl:text-[clamp(8px,0.78vw,13px)]"
    >
      {portrait.lines.map((line, i) => (
        <motion.span
          key={i}
          initial={reduceMotion ? false : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 0.5,
                  delay: 0.15 + i * 0.012,
                  ease: "easeOut",
                }
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
