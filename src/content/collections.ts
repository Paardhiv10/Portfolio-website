/** Everything the three interest pages render. Nothing here is invented — a null
 * means a file or link does not exist yet, and each page renders around it. */

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

// Each `spotify` id is the original studio cut, not a remix or live version,
// and was opened and checked against its page title before being pasted here.
export const tracks: Track[] = [
  {
    id: "durga",
    title: "Durga",
    artist: "Advaita",
    audio: null,
    spotify: "https://open.spotify.com/track/5RurYlUMMktRU3sOJbSZB2",
    label: "#ff3f1a",
  },
  {
    id: "vishnu",
    title: "Vishnu",
    artist: "Peter Cat Recording Co.",
    audio: null,
    spotify: "https://open.spotify.com/track/416JjjLmrkcvsFVzSf9B9E",
    label: "#44797f",
  },
  {
    id: "wonderful-world",
    title: "What a Wonderful World",
    artist: "Louis Armstrong",
    audio: null,
    spotify: "https://open.spotify.com/track/29U7stRjqHU6rMiS8BfaI9",
    label: "#fcf75e",
  },
  {
    id: "i-have-the-touch",
    title: "I Have the Touch",
    artist: "Peter Gabriel",
    audio: null,
    spotify: "https://open.spotify.com/track/2grqilf5SUJFx0WYMFpaOO",
    label: "#97d6df",
  },
  {
    id: "wavin-flag",
    title: "Wavin' Flag",
    artist: "K'naan",
    audio: null,
    spotify: "https://open.spotify.com/track/0zREtnLmVnt8KUJZZbSdla",
    label: "#16309b",
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
