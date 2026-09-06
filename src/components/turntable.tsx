"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Track } from "@/content/collections";
import { useSound } from "@/lib/sound-context";

/** Viewport-relative pointer position, whatever kind of event motion hands us. */
function viewportPoint(
  e: MouseEvent | TouchEvent | PointerEvent,
): { x: number; y: number } | null {
  if ("clientX" in e) return { x: e.clientX, y: e.clientY };
  const t = e.changedTouches?.[0];
  return t ? { x: t.clientX, y: t.clientY } : null;
}

/** Spotify's embed for a track link. A plain iframe on purpose: the embed API
 * cannot start playback for a logged-out visitor, so Spotify owns the button. */
function spotifyEmbed(spotify: string | null): string | null {
  if (!spotify) return null;
  const id =
    /open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/([A-Za-z0-9]+)/.exec(
      spotify,
    );
  return id ? `https://open.spotify.com/embed/track/${id[1]}` : null;
}

/** A record, drawn at whatever size its box gives it. */
function Record({ label, spinning }: { label: string; spinning: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      animate={spinning && !reduceMotion ? { rotate: 360 } : { rotate: 0 }}
      transition={
        spinning
          ? { duration: 1.8, repeat: Infinity, ease: "linear" }
          : { duration: 0.4 }
      }
      style={{ transformBox: "view-box", transformOrigin: "50px 50px" }}
    >
      <circle cx="50" cy="50" r="49" fill="#141414" />
      <g fill="none" stroke="#e8ebf3" strokeOpacity="0.13" strokeWidth="0.8">
        {[44, 40, 36, 32, 28, 24].map((r) => (
          <circle key={r} cx="50" cy="50" r={r} />
        ))}
      </g>
      <path
        d="M16 26 A42 42 0 0 1 76 19"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.16"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="19" fill={label} />
      <circle cx="50" cy="50" r="3.2" fill="#f0e8dd" />
    </motion.svg>
  );
}

export function Turntable({ tracks }: { tracks: Track[] }) {
  const { play } = useSound();
  const platterRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const draggedRef = useRef(false);
  const landingRef = useRef(0);
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // One <audio> element reused across records, torn down on unmount so a track
  // can't outlive the page.
  useEffect(() => {
    const el = audioRef.current;
    return () => {
      el?.pause();
    };
  }, []);

  function land(track: Track) {
    // Bumped on every landing so a stale play() rejection (from swapping
    // `src` mid-flight) can't overwrite a track that's now playing fine.
    const gen = ++landingRef.current;
    const el = audioRef.current;

    setNowPlaying(track);

    if (!track.audio) {
      // Stop any track already playing, since toggle() can't pause one
      // that has no audio.
      el?.pause();
      setPlaying(false);
      // Spotify's player below is the playback path when there's no MP3, so
      // only apologise when there's nothing to play at all.
      setMessage(
        spotifyEmbed(track.spotify) ? null : "No audio file for this one yet.",
      );
      return;
    }

    setMessage(null);
    if (!el) return;
    el.src = track.audio;
    el.play()
      .then(() => {
        if (gen === landingRef.current) setPlaying(true);
      })
      .catch(() => {
        if (gen !== landingRef.current) return; // superseded by a later landing
        setPlaying(false);
        setMessage("Tap the platter to start playback.");
      });
  }

  function toggle() {
    const el = audioRef.current;
    if (!el || !nowPlaying?.audio) return;
    if (el.paused) {
      el.play()
        .then(() => {
          setPlaying(true);
          // Clear the autoplay-blocked hint — the tap it asked for just happened.
          setMessage(null);
        })
        .catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  // Only when there's no MP3 of our own to play.
  const embed = nowPlaying?.audio
    ? null
    : spotifyEmbed(nowPlaying?.spotify ?? null);

  return (
    <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-20">
      {/* the crate */}
      <div>
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-mirage/40">
          Drag a record onto the platter — or just click one
        </p>

        <div className="flex flex-wrap gap-8">
          {tracks.map((t) => (
            <div key={t.id} className="w-[132px]">
              <motion.div
                drag
                dragSnapToOrigin
                dragElastic={0.14}
                whileDrag={{ scale: 1.1, zIndex: 50, cursor: "grabbing" }}
                whileHover={{ y: -6 }}
                // Drag is the fun path but unusable by keyboard, so the record is a button
                // too. The ref guard stops the post-drag click firing a second time.
                role="button"
                tabIndex={0}
                aria-label={`Play ${t.title} by ${t.artist}`}
                // motion's tap, not onClick: the drag gesture preventDefaults pointerdown,
                // which cancels the native click that would otherwise follow.
                onTap={() => {
                  if (draggedRef.current) return;
                  land(t);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    land(t);
                  }
                }}
                onDragStart={() => {
                  draggedRef.current = true;
                  play("hover");
                }}
                onDragEnd={(event) => {
                  // Hit-test the pointer, not the dragged box — the record is bigger than the
                  // spindle. clientX/Y, not motion's `info.point`, which is off by the scroll.
                  const p = platterRef.current?.getBoundingClientRect();
                  const point = viewportPoint(event);
                  if (!p || !point) return;
                  if (
                    point.x >= p.left &&
                    point.x <= p.right &&
                    point.y >= p.top &&
                    point.y <= p.bottom
                  ) {
                    land(t);
                  }
                  // Released after the click event would have fired.
                  window.setTimeout(() => {
                    draggedRef.current = false;
                  }, 0);
                }}
                // `relative` is load-bearing: z-index (raised by whileDrag) is
                // ignored on static elements, so the record painted under the deck.
                className="relative aspect-square cursor-grab touch-none"
                style={{
                  filter: "drop-shadow(0 10px 18px rgba(27,29,26,0.28))",
                }}
              >
                <Record label={t.label} spinning={false} />
              </motion.div>
              {/* Wraps rather than truncating: real titles and band names run
                  past the 132px sleeve, and a clipped one reads as a bug. */}
              <p className="mt-3 text-pretty font-display text-base leading-snug tracking-tight">
                {t.title}
              </p>
              <p className="text-pretty font-mono text-[10px] leading-snug text-mirage/45">
                {t.artist}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* the deck */}
      <div>
        <div
          className="relative border border-mirage/12 p-7"
          style={{
            background: "#2a2622",
            backgroundImage:
              "repeating-linear-gradient(94deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 7px)",
          }}
        >
          <div
            ref={platterRef}
            onClick={toggle}
            // Only a keyboard control once a track is loaded — otherwise a
            // record could be started from the keyboard but never paused.
            {...(nowPlaying?.audio
              ? {
                  role: "button" as const,
                  tabIndex: 0,
                  "aria-label": playing
                    ? `Pause ${nowPlaying.title}`
                    : `Play ${nowPlaying.title}`,
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle();
                    }
                  },
                }
              : {})}
            className="relative mx-auto grid aspect-square w-full max-w-[280px] cursor-pointer place-items-center rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #4a443d 0%, #33302b 62%, #262320 100%)",
              boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            {nowPlaying ? (
              <div className="h-[86%] w-[86%]">
                <Record label={nowPlaying.label} spinning={playing} />
              </div>
            ) : (
              <span className="px-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-chalk/35">
                Drop a record here
              </span>
            )}
            {/* spindle */}
            <span className="pointer-events-none absolute h-2 w-2 rounded-full bg-chalk/60" />
          </div>

          {/* tonearm */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-8 right-8 h-[150px] w-[10px] origin-top"
            animate={{ rotate: playing ? -26 : -6 }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
          >
            <div className="mx-auto h-full w-[3px] rounded bg-chalk/45" />
            <div className="absolute -top-1.5 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-chalk/50" />
            <div className="absolute bottom-0 left-1/2 h-3 w-5 -translate-x-1/2 rounded-sm bg-chalk/60" />
          </motion.div>
        </div>

        <div className="mt-5 min-h-[76px]">
          {nowPlaying ? (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-orange">
                {playing ? "Now playing" : "Cued"}
              </p>
              <p className="mt-2 font-display text-2xl tracking-tight">
                {nowPlaying.title}
              </p>
              <p className="font-mono text-[11px] text-mirage/50">
                {nowPlaying.artist}
              </p>
              {/* Spotify is the player only when there's no MP3. `key` remounts
                  it per track — swapping `src` pushes iframe history entries. */}
              {embed ? (
                <iframe
                  key={embed}
                  src={embed}
                  title={`${nowPlaying.title} by ${nowPlaying.artist} on Spotify`}
                  height={152}
                  loading="lazy"
                  allow="encrypted-media; clipboard-write; picture-in-picture"
                  className="mt-3 w-full rounded-xl border-0"
                />
              ) : nowPlaying.spotify ? (
                <a
                  href={nowPlaying.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block border-b border-mirage/25 font-mono text-[11px] text-mirage/55 transition-colors hover:border-orange hover:text-orange"
                >
                  Open in Spotify
                </a>
              ) : null}
              {message && (
                <p className="mt-2 font-mono text-[11px] text-mirage/45">
                  {message}
                </p>
              )}
            </>
          ) : (
            <p className="font-mono text-[11px] text-mirage/40">
              The platter is empty.
            </p>
          )}
        </div>

        <audio
          ref={audioRef}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        />
      </div>
    </div>
  );
}
