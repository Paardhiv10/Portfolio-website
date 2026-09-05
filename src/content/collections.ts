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
  /** Purchase year isn't tracked, so this stays null rather than guessed. */
  year: string | null;
  /** /public/sneakers/<file>.png — background-removed, shot from the side. */
  photo: string | null;
  note: string;
};

export const sneakers: Sneaker[] = [
  {
    id: "first-pair",
    name: "Air Jordan 1 Low",
    brand: "Air Jordan",
    colourway: "Cement Fire Red",
    year: null,
    photo: "/sneakers/first-pair.png",
    note: "The first pair I bought myself.",
  },
  {
    id: "industrial-blue",
    name: "Air Jordan 1 Low",
    brand: "Air Jordan",
    colourway: "Industrial Blue",
    year: null,
    photo: "/sneakers/industrial-blue.png",
    note: "My second pair of Jordans.",
  },
  {
    id: "initiator",
    name: "Initiator",
    brand: "Nike",
    colourway: "Cargo Khaki",
    year: null,
    photo: "/sneakers/initiator.png",
    note: "My daily beater.",
  },
  {
    id: "onitsuka-tiger",
    name: "Mexico 66",
    brand: "Onitsuka Tiger",
    colourway: "Birch Green",
    year: null,
    photo: "/sneakers/onitsuka-tiger.png",
    note: "The pair I love the most.",
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
  /** Background-removed tail photo in /public/fins, normalised to 512². */
  fin: string;
};

export const flights: Flight[] = [
  { id: "vistara", airline: "Vistara", fin: "/fins/vistara.png" },
  { id: "akasa", airline: "Akasa Air", fin: "/fins/akasa.png" },
  {
    id: "airindia-express",
    airline: "Air India Express",
    fin: "/fins/airindia_express.png",
  },
  { id: "airasia", airline: "AirAsia", fin: "/fins/airasia.png" },
  { id: "spicejet", airline: "SpiceJet", fin: "/fins/spicejet.png" },
  { id: "indigo", airline: "IndiGo", fin: "/fins/indigo.png" },
];
