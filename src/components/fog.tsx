"use client";

import { motion } from "motion/react";

/**
 * Cloud and fog for the footer stamp.
 *
 * A puff is built from overlapping soft-edged radial gradients — one blob per
 * lobe — then blurred as a whole so the seams between lobes disappear and it
 * reads as vapour rather than as circles. The fractal-noise overlay is what
 * makes it smoky instead of merely soft; without it a blurred gradient looks
 * like an airbrush smudge.
 */

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * `alpha` is per-lobe, not the puff's final opacity. The five lobes overlap and
 * composite over each other, so where they stack the result lands near
 * 1-(1-alpha)^n — roughly three to four times the value passed in. Keep these
 * numbers far lower than the opacity you actually want.
 */
function puffBackground(alpha: number) {
  const w = (a: number) => `rgba(255,255,255,${(alpha * a).toFixed(3)})`;
  return [
    `radial-gradient(45% 58% at 22% 62%, ${w(1)}, transparent 70%)`,
    `radial-gradient(38% 74% at 43% 42%, ${w(0.95)}, transparent 70%)`,
    `radial-gradient(42% 54% at 66% 54%, ${w(0.9)}, transparent 70%)`,
    `radial-gradient(58% 34% at 50% 74%, ${w(0.8)}, transparent 74%)`,
    `radial-gradient(30% 44% at 84% 66%, ${w(0.7)}, transparent 70%)`,
  ].join(", ");
}

export function Puff({
  className = "",
  alpha = 0.5,
  blur = 18,
  duration = 26,
  delay = 0,
  drift = 34,
  rise = 10,
}: {
  className?: string;
  alpha?: number;
  blur?: number;
  duration?: number;
  delay?: number;
  drift?: number;
  rise?: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      // Only transform is animated, so the blur is rasterised once rather than
      // re-run every frame.
      animate={{ x: [0, drift, 0], y: [0, -rise, 0], scale: [1, 1.07, 1] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ willChange: "transform" }}
    >
      <div
        className="h-full w-full"
        style={{ background: puffBackground(alpha), filter: `blur(${blur}px)` }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: NOISE,
          opacity: 0.16,
          mixBlendMode: "overlay",
          maskImage: puffBackground(1),
          WebkitMaskImage: puffBackground(1),
          filter: `blur(${blur * 0.4}px)`,
        }}
      />
    </motion.div>
  );
}

/** The quiet bank that always hangs around the falcon. */
export function AmbientFog() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Puff
        className="right-[2%] bottom-[18%] h-[190px] w-[420px] sm:h-[240px] sm:w-[540px]"
        alpha={0.05}
        blur={26}
        duration={30}
        drift={40}
      />
      <Puff
        className="right-[24%] top-[16%] h-[150px] w-[330px] sm:h-[180px] sm:w-[420px]"
        alpha={0.038}
        blur={30}
        duration={38}
        delay={3}
        drift={-30}
        rise={16}
      />
    </div>
  );
}

/**
 * The denser field that only exists where the cursor is. Rendered in full and
 * then masked down to a soft disc that the pointer drags around — so the
 * clouds feel like they were always there and the mouse is clearing the
 * condensation off the glass.
 */
export function HiddenClouds() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <Puff
        className="left-[4%] top-[12%] h-[200px] w-[440px]"
        alpha={0.19}
        blur={22}
        duration={24}
        drift={46}
      />
      <Puff
        className="left-[34%] bottom-[8%] h-[220px] w-[480px]"
        alpha={0.16}
        blur={26}
        duration={32}
        delay={2}
        drift={-38}
        rise={14}
      />
      <Puff
        className="right-[6%] top-[30%] h-[240px] w-[520px]"
        alpha={0.21}
        blur={20}
        duration={28}
        delay={1}
        drift={34}
        rise={18}
      />
      <Puff
        className="left-[18%] top-[42%] h-[160px] w-[360px]"
        alpha={0.13}
        blur={28}
        duration={36}
        delay={4}
        drift={-26}
      />
    </div>
  );
}
