"use client";

import { Fragment, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Glyphs the unresolved letters cycle through before settling. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ&%#@*<>/\\";
const TICK_MS = 40;
/** Ticks each letter spends scrambling before the next one locks in. */
const TICKS_PER_LETTER = 3;

export function ScrambleText({
  text,
  scrambleWords = 1,
  className,
}: {
  text: string;
  /** How many words, counting from the end, actually scramble. */
  scrambleWords?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const words = text
    .split(" ")
    .reduce<{ word: string; start: number }[]>((acc, word) => {
      const prev = acc[acc.length - 1];
      const start = prev ? prev.start + prev.word.length + 1 : 0;
      return [...acc, { word, start }];
    }, []);

  // Only the tail scrambles. Everything before it is settled from the first
  // frame, so the effect lands as an accent on the end of the line rather
  // than churning through the whole thing.
  const firstScrambled = words[Math.max(0, words.length - scrambleWords)];
  const scrambleFrom = firstScrambled ? firstScrambled.start : 0;

  // Starts settled, so a reduced-motion visitor (and the server-rendered
  // markup) simply shows the finished text and this effect never touches it.
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduceMotion) return;

    let tick = 0;
    const id = setInterval(() => {
      tick += 1;
      const settled = scrambleFrom + Math.floor(tick / TICKS_PER_LETTER);

      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            // spaces stay put so the word shapes read as words the whole way
            if (ch === " " || i < settled) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );

      if (settled >= text.length) clearInterval(id);
    }, TICK_MS);

    return () => clearInterval(id);
  }, [text, reduceMotion, scrambleFrom]);

  return (
    <span className={className}>
      {/* the real text for assistive tech — the scramble is decoration */}
      <span className="sr-only">{text}</span>
      {words.map(({ word, start }, i) => {
        const settledWord = start < scrambleFrom;
        return (
          <Fragment key={start}>
            {i > 0 && " "}
            {settledWord ? (
              <span aria-hidden>{word}</span>
            ) : (
              // Each scrambling word gets its own box, sized by an invisible
              // copy of the final word with the animated copy laid over it.
              // A random glyph is wider or narrower than the letter it stands
              // in for, so without a pinned box the line would rewrap — and on
              // a phone, where the name breaks across two lines, the break
              // itself would jump around while the name resolved.
              <span aria-hidden className="relative inline-block">
                <span className="invisible">{word}</span>
                <span className="absolute inset-0">
                  {display.slice(start, start + word.length)}
                </span>
              </span>
            )}
          </Fragment>
        );
      })}
    </span>
  );
}
