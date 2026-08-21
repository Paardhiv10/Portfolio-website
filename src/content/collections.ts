/**
 * Everything the three interest pages render.
 *
 * Nothing in here is invented — the entries below are placeholders in the same
 * REPLACE_ME style the rest of the content file uses, so the pages have shape
 * to lay out without ever claiming something untrue. Swap the values and drop
 * the matching files into /public and the pages fill themselves in.
 */

export type Sneaker = {
  id: string;
  name: string;
  brand: string;
  colourway: string;
  year: string;
  /** /public/sneakers/<file>.png — background-removed, shot from the side. */
  photo: string | null;
  note: string;
};

export const sneakers: Sneaker[] = [
  {
    id: "s1",
    name: "REPLACE_ME",
    brand: "REPLACE_ME",
    colourway: "REPLACE_ME",
    year: "20XX",
    photo: null,
    note: "A line about why this one matters.",
  },
  {
    id: "s2",
    name: "REPLACE_ME",
    brand: "REPLACE_ME",
    colourway: "REPLACE_ME",
    year: "20XX",
    photo: null,
    note: "A line about why this one matters.",
  },
  {
    id: "s3",
    name: "REPLACE_ME",
    brand: "REPLACE_ME",
    colourway: "REPLACE_ME",
    year: "20XX",
    photo: null,
    note: "A line about why this one matters.",
  },
  {
    id: "s4",
    name: "REPLACE_ME",
    brand: "REPLACE_ME",
    colourway: "REPLACE_ME",
    year: "20XX",
    photo: null,
    note: "A line about why this one matters.",
  },
];

export type Track = {
  id: string;
  title: string;
  artist: string;
  /** /public/music/<file>.mp3 — what actually plays when the record lands. */
  audio: string | null;
  /** Optional: the Spotify page for the track, linked under the platter. */
  spotify: string | null;
  /** Centre-label colour, so the stack of records reads as different pressings. */
  label: string;
};

export const tracks: Track[] = [
  {
    id: "t1",
    title: "REPLACE_ME",
    artist: "REPLACE_ME",
    audio: null,
    spotify: null,
    label: "#ff3f1a",
  },
  {
    id: "t2",
    title: "REPLACE_ME",
    artist: "REPLACE_ME",
    audio: null,
    spotify: null,
    label: "#44797f",
  },
  {
    id: "t3",
    title: "REPLACE_ME",
    artist: "REPLACE_ME",
    audio: null,
    spotify: null,
    label: "#fcf75e",
  },
  {
    id: "t4",
    title: "REPLACE_ME",
    artist: "REPLACE_ME",
    audio: null,
    spotify: null,
    label: "#97d6df",
  },
];

export type Flight = {
  id: string;
  airline: string;
  /** IATA code inked small under the fin. */
  code: string;
  route: string;
  year: string;
  /** Livery colours — the fin is drawn, so no photo licensing to worry about. */
  fin: { stabilizer: string; rudder: string; mark: string };
};

export const flights: Flight[] = [
  {
    id: "f1",
    airline: "REPLACE_ME",
    code: "XX",
    route: "AAA — BBB",
    year: "20XX",
    fin: { stabilizer: "#16309b", rudder: "#0f2377", mark: "#e8ebf3" },
  },
  {
    id: "f2",
    airline: "REPLACE_ME",
    code: "XX",
    route: "AAA — BBB",
    year: "20XX",
    fin: { stabilizer: "#ff3f1a", rudder: "#c22c0d", mark: "#f0e8dd" },
  },
  {
    id: "f3",
    airline: "REPLACE_ME",
    code: "XX",
    route: "AAA — BBB",
    year: "20XX",
    fin: { stabilizer: "#44797f", rudder: "#335d62", mark: "#e8ebf3" },
  },
  {
    id: "f4",
    airline: "REPLACE_ME",
    code: "XX",
    route: "AAA — BBB",
    year: "20XX",
    fin: { stabilizer: "#1b1d1a", rudder: "#000000", mark: "#fcf75e" },
  },
  {
    id: "f5",
    airline: "REPLACE_ME",
    code: "XX",
    route: "AAA — BBB",
    year: "20XX",
    fin: { stabilizer: "#efe3cd", rudder: "#d9c9a8", mark: "#1b1d1a" },
  },
  {
    id: "f6",
    airline: "REPLACE_ME",
    code: "XX",
    route: "AAA — BBB",
    year: "20XX",
    fin: { stabilizer: "#97d6df", rudder: "#6fb9c4", mark: "#1b1d1a" },
  },
];
