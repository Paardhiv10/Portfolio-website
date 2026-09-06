<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working on this repo

## Never build while the dev server is running

`next build` and `next dev` share `.next/`. Running the build against a live dev
server replaces its manifests mid-flight; the dev server stays up and holds the
port but hangs on every request, which looks like a broken app rather than a
tooling conflict. Stop the dev server first — `next build` in this version has
no `--distDir` flag, so there is no way to build around a running one.

## Outstanding placeholders

None left — `REPLACE_ME` no longer appears in `src/`. Sneakers, records and
flights all carry real entries.

What is still missing is files, not copy: `audio` and `spotify` are `null` on
every record, and the interest cut-outs below have no images. Those nulls are
deliberate — each page renders around one rather than inventing a link or a
stat. Fill them in rather than deleting the field.

## Image directories that are wired but empty

- `public/interests/` — `vinyl.png`, `cube.png`, `sneaker.png`, `tailfin.png`,
  `startups.png`, `shuttlecock.png`. Background-removed cut-outs. Each inline
  figure in the Interests sentence swaps from its drawn SVG to the photo as soon
  as the file exists and the entry's `photo` field points at it.
- `public/music/` — one MP3 per track; a record with `audio: null` still cues on
  the platter and reports that it has no file

`public/education/hult/`, `public/education/ecell/` and `public/sneakers/` are
filled in: real photos, resized from the originals kept in `assets/source/`.

## The graduation stamp

`public/education/grad-stamp.webp` is generated, not hand-made: the portrait in
`assets/source/education/grad-original.png` cropped, then given a paper border
with the perforations punched out of the alpha channel. WebP rather than JPEG
because those notches need transparency — bake a background colour in and the
stamp gets a visible rectangle the moment the section is recoloured. Keep the
paper lighter than `--color-cream` or the teeth disappear against the page, and
keep the CSS `drop-shadow` (not `box-shadow`), which is what makes the scalloped
edge read at all.

## Sticky-note metrics

Project notes take an optional `metric` (`{ value: "630+", label: "installs" }`)
rendered large on the note. Leave it `null` when there is no real figure — the
note renders fine without one.
