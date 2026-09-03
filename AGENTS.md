<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working on this repo

## Never build while the dev server is running

`next build` and `next dev` share `.next/`. Running the build against a live dev
server replaces its manifests mid-flight; the dev server stays up and holds the
port but hangs on every request, which looks like a broken app rather than a
tooling conflict. Stop the dev server first, or build with `--distDir`.

## Outstanding placeholders

Grep for `REPLACE_ME`. Currently:

- `src/content/site.ts` — the WCA extension description, and the degree line
- `src/content/collections.ts` — every sneaker and record entry. Flights are
  done: they carry only a name and a cut-out fin image, by design, so there is
  nothing left to fill in there.

These are deliberate: the pages need shape to lay out, and inventing a
collection or a flight history would put false claims on a portfolio. Fill them
in rather than deleting them.

## Image directories that are wired but empty

- `public/interests/` — `vinyl.png`, `cube.png`, `sneaker.png`, `tailfin.png`,
  `startups.png`, `shuttlecock.png`. Background-removed cut-outs. Each inline
  figure in the Interests sentence swaps from its drawn SVG to the photo as soon
  as the file exists and the entry's `photo` field points at it.
- `public/sneakers/` — one photo per pair
- `public/music/` — one MP3 per track; a record with `audio: null` still cues on
  the platter and reports that it has no file

## Sticky-note metrics

Project notes take an optional `metric` (`{ value: "600+", label: "installs" }`)
rendered large on the note. Leave it `null` when there is no real figure — the
note renders fine without one.
