"use client";

import { motion } from "motion/react";

/**
 * Inline cut-out figures for the Interests sentence. Each is a self-contained
 * SVG on a 0–100 viewBox so it can be dropped inline at any font size, and each
 * exposes a "hover" variant that the parent <Figure> drives — the parent scales
 * the whole thing up, these add the bit of character on top (the record spins,
 * the rudder actually deflects, and so on).
 *
 * Everything is drawn from the site palette so the figures read as part of the
 * same paper-and-ink world as the stamps and sticky notes.
 */

const MIRAGE = "#1b1d1a";
const ORANGE = "#ff3f1a";
const ORANGE_DEEP = "#c22c0d";
const JADE = "#44797f";
const AQUA = "#97d6df";
const CANARY = "#fcf75e";
const CHALK = "#e8ebf3";
const CREAM = "#f0e8dd";

/** Origin helper — SVG needs an explicit box for transforms to behave. */
const viewBoxOrigin = (x: number, y: number) =>
  ({ transformBox: "view-box", transformOrigin: `${x}px ${y}px` }) as const;

/** Music — a 45rpm record that spins up while you're on it. */
export function Vinyl() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <motion.g
        variants={{
          rest: { rotate: 0 },
          hover: {
            rotate: 360,
            transition: { duration: 1.8, repeat: Infinity, ease: "linear" },
          },
        }}
        style={viewBoxOrigin(50, 50)}
      >
        <circle cx="50" cy="50" r="48" fill={MIRAGE} />
        <g fill="none" stroke={CHALK} strokeOpacity="0.16" strokeWidth="1">
          <circle cx="50" cy="50" r="43" />
          <circle cx="50" cy="50" r="38.5" />
          <circle cx="50" cy="50" r="34" />
          <circle cx="50" cy="50" r="29.5" />
          <circle cx="50" cy="50" r="25" />
        </g>
        {/* the light catching the vinyl — what makes it read as a record */}
        <path
          d="M18 24 A40 40 0 0 1 74 17"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.2"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="50" cy="50" r="19" fill={ORANGE} />
        <path
          d="M50 35 A15 15 0 0 1 65 50"
          fill="none"
          stroke={CANARY}
          strokeOpacity="0.85"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="50" cy="50" r="3.4" fill={CREAM} />
      </motion.g>
    </svg>
  );
}

/** Startups — a paper rocket, flame flickering on hover. */
export function Rocket() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <motion.g
        variants={{
          rest: { rotate: 0, y: 0 },
          hover: {
            rotate: -8,
            y: -4,
            transition: { type: "spring", stiffness: 260, damping: 12 },
          },
        }}
        style={viewBoxOrigin(50, 60)}
      >
        {/* flame */}
        <motion.path
          d="M39 68 Q50 96 61 68 Q50 76 39 68 Z"
          fill={CANARY}
          variants={{
            rest: { scaleY: 1, opacity: 0.9 },
            hover: {
              scaleY: [1, 1.45, 1.1, 1.5, 1],
              opacity: 1,
              transition: { duration: 0.7, repeat: Infinity },
            },
          }}
          style={viewBoxOrigin(50, 68)}
        />
        <motion.path
          d="M44 68 Q50 84 56 68 Z"
          fill={ORANGE}
          variants={{
            rest: { scaleY: 1 },
            hover: {
              scaleY: [1, 1.5, 1.15, 1.4, 1],
              transition: { duration: 0.55, repeat: Infinity },
            },
          }}
          style={viewBoxOrigin(50, 68)}
        />
        {/* fins — wide enough to still read as fins at 1em */}
        <path
          d="M30 46 L12 74 L30 66 Z"
          fill={ORANGE}
          stroke={MIRAGE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M70 46 L88 74 L70 66 Z"
          fill={ORANGE}
          stroke={MIRAGE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* body */}
        <path
          d="M50 3 C66 20 72 42 72 68 L28 68 C28 42 34 20 50 3 Z"
          fill="#ffffff"
          stroke={MIRAGE}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M50 3 C59 12 64 22 67 32 L33 32 C36 22 41 12 50 3 Z"
          fill={ORANGE}
          stroke={MIRAGE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="46" r="11" fill={AQUA} stroke={MIRAGE} strokeWidth="3.5" />
      </motion.g>
    </svg>
  );
}

/**
 * Cubing — an isometric 3×3, built from two edge vectors per face rather than
 * 27 hand-written quads. Twists on hover.
 */
function IsoFace({
  o,
  u,
  v,
  fill,
}: {
  o: [number, number];
  u: [number, number];
  v: [number, number];
  fill: string;
}) {
  const at = (a: number, b: number) =>
    `${(o[0] + (u[0] * a) / 3 + (v[0] * b) / 3).toFixed(2)},${(
      o[1] +
      (u[1] * a) / 3 +
      (v[1] * b) / 3
    ).toFixed(2)}`;

  const cells = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      cells.push(
        <path
          key={`${i}-${j}`}
          d={`M${at(i, j)} L${at(i + 1, j)} L${at(i + 1, j + 1)} L${at(i, j + 1)} Z`}
          fill={fill}
          stroke={MIRAGE}
          strokeWidth="2"
          strokeLinejoin="round"
        />,
      );
    }
  }
  return <>{cells}</>;
}

export function RubiksCube() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <motion.g
        variants={{
          rest: { rotate: 0 },
          hover: {
            rotate: [0, -9, 7, -4, 0],
            transition: { duration: 1.1, repeat: Infinity },
          },
        }}
        style={viewBoxOrigin(50, 50)}
      >
        {/* top face — white */}
        <IsoFace o={[16, 30]} u={[34, -20]} v={[34, 20]} fill={CHALK} />
        {/* left face — orange */}
        <IsoFace o={[16, 30]} u={[34, 20]} v={[0, 40]} fill={ORANGE} />
        {/* right face — green */}
        <IsoFace o={[50, 50]} u={[34, -20]} v={[0, 40]} fill={JADE} />
      </motion.g>
    </svg>
  );
}

/**
 * Badminton — a shuttlecock, wobbling like it's just been hit. Drawn as one
 * solid flared skirt with division lines rather than separate feather
 * triangles; the earlier version collapsed into a fan shape at inline size.
 */
export function Shuttlecock() {
  // Points along the skirt's bottom and top edges, at matching parameters, so
  // the division lines splay the way real feathers do.
  const divisions: [number, number, number, number][] = [
    [39.8, 66, 27.8, 23.2],
    [46.6, 66, 42.6, 21.2],
    [53.4, 66, 57.4, 21.2],
    [60.2, 66, 72.2, 23.2],
  ];

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <motion.g
        variants={{
          rest: { rotate: 0 },
          hover: {
            rotate: [0, -13, 11, -6, 0],
            transition: { duration: 0.9, repeat: Infinity },
          },
        }}
        style={viewBoxOrigin(50, 80)}
      >
        {/* skirt */}
        <path
          d="M33 66 L13 27 Q50 15 87 27 L67 66 Z"
          fill="#ffffff"
          stroke={MIRAGE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {divisions.map(([x1, y1, x2, y2], i) => (
          <path
            key={i}
            d={`M${x1} ${y1} L${x2} ${y2}`}
            stroke={MIRAGE}
            strokeWidth="2"
            strokeOpacity="0.55"
            strokeLinecap="round"
          />
        ))}
        {/* the string binding that holds the skirt together */}
        <path
          d="M23 44 Q50 52 77 44"
          fill="none"
          stroke={MIRAGE}
          strokeWidth="2"
          strokeOpacity="0.45"
          strokeLinecap="round"
        />
        {/* cork */}
        <path
          d="M33 64 L67 64 L67 74 A17 17 0 0 1 33 74 Z"
          fill={CREAM}
          stroke={MIRAGE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M34 72 L66 72" stroke={ORANGE} strokeWidth="3.5" />
      </motion.g>
    </svg>
  );
}

/** Sneakers — a low-top in profile, tipping onto its toe on hover. */
export function Sneaker() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <motion.g
        variants={{
          rest: { rotate: 0 },
          hover: {
            rotate: [0, -12, 0, -12, 0],
            transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
          },
        }}
        style={viewBoxOrigin(88, 84)}
      >
        {/* outsole */}
        <path
          d="M8 74 L92 74 Q96 74 96 79 Q96 86 88 86 L16 86 Q8 86 8 79 Z"
          fill={CREAM}
          stroke={MIRAGE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* upper */}
        <path
          d="M14 74 L14 50 Q16 38 30 36 L44 34 L55 46 Q66 55 80 57 Q92 59 92 68 L92 74 Z"
          fill={AQUA}
          stroke={MIRAGE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* toe cap */}
        <path
          d="M76 56 Q92 59 92 68 L92 74 L74 74 Z"
          fill="#ffffff"
          stroke={MIRAGE}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* side stripe */}
        <path
          d="M30 70 Q44 58 58 56"
          fill="none"
          stroke={ORANGE}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* laces */}
        <g stroke={MIRAGE} strokeWidth="2.5" strokeLinecap="round">
          <path d="M34 42 L44 48" />
          <path d="M40 39 L50 46" />
          <path d="M46 37 L55 45" />
        </g>
      </motion.g>
    </svg>
  );
}

/**
 * Travel — an aircraft vertical stabilizer. The rudder is a separate group
 * hinged at its leading edge, so on hover it deflects the way a real one does.
 */
export function TailFin() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <motion.g
        variants={{
          rest: { rotate: 0 },
          hover: {
            rotate: -3,
            transition: { type: "spring", stiffness: 200, damping: 14 },
          },
        }}
        style={viewBoxOrigin(50, 84)}
      >
        {/* rudder — the hinged control surface, deflects on hover */}
        <motion.path
          d="M65 12 L83 12 L81 84 L63 84 Z"
          fill={ORANGE_DEEP}
          stroke={MIRAGE}
          strokeWidth="3"
          strokeLinejoin="round"
          variants={{
            rest: { rotate: 0 },
            hover: {
              rotate: [0, 12, 0, -12, 0],
              transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
            },
          }}
          style={viewBoxOrigin(65, 12)}
        />
        {/* fixed vertical stabilizer */}
        <path
          d="M9 84 L53 12 L66 12 L64 84 Z"
          fill={ORANGE}
          stroke={MIRAGE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* livery chevron */}
        <path d="M24 70 L48 30 L57 30 L33 70 Z" fill="#ffffff" fillOpacity="0.9" />
        {/* the tailplane it stands on */}
        <path
          d="M4 84 L92 84 L92 93 L4 93 Z"
          fill={MIRAGE}
          strokeLinejoin="round"
        />
      </motion.g>
    </svg>
  );
}
