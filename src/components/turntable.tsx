"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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

/** Spotify's embed: a plain iframe, since the API cannot start a logged-out play. */
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

/** The deck: an empty platter until a record lands, then the arm swings over. */
function Deck({
  label,
  spinning,
}: {
  label: string | null;
  spinning: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const loaded = label !== null;
  return (
    <svg viewBox="0 0 140 100" className="h-full w-full" aria-hidden="true">
      {/* plinth */}
      <rect x="1" y="1" width="138" height="98" rx="7" fill="#e6ddcf" />
      <rect
        x="1"
        y="1"
        width="138"
        height="98"
        rx="7"
        fill="none"
        stroke="#1b1d1a"
        strokeOpacity="0.14"
      />
      {/* platter and mat */}
      <circle cx="50" cy="50" r="45" fill="#1b1d1a" fillOpacity="0.14" />
      <circle cx="50" cy="50" r="42" fill="#2a2a28" />
      <g fill="none" stroke="#e8ebf3" strokeOpacity="0.06" strokeWidth="0.6">
        {[38, 30, 22].map((r) => (
          <circle key={r} cx="50" cy="50" r={r} />
        ))}
      </g>
      {!loaded && (
        // CSS spin, not motion: motion rewrites the SVG origin and the ring drifts.
        <circle
          cx="50"
          cy="50"
          r="33"
          fill="none"
          stroke="#e8ebf3"
          strokeOpacity="0.35"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          className="animate-[spin_24s_linear_infinite] motion-reduce:animate-none"
          style={{ transformBox: "view-box", transformOrigin: "50px 50px" }}
        />
      )}
      <AnimatePresence>
        {loaded && (
          <motion.g
            key={label}
            initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ transformBox: "view-box", transformOrigin: "50px 50px" }}
          >
            <motion.g
              animate={
                spinning && !reduceMotion ? { rotate: 360 } : { rotate: 0 }
              }
              transition={
                spinning
                  ? { duration: 1.8, repeat: Infinity, ease: "linear" }
                  : { duration: 0.4 }
              }
              style={{ transformBox: "view-box", transformOrigin: "50px 50px" }}
            >
              <circle cx="50" cy="50" r="40" fill="#141414" />
              <g
                fill="none"
                stroke="#e8ebf3"
                strokeOpacity="0.13"
                strokeWidth="0.7"
              >
                {[36, 32, 28, 24, 20].map((r) => (
                  <circle key={r} cx="50" cy="50" r={r} />
                ))}
              </g>
              <path
                d="M22 30 A34 34 0 0 1 70 23"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.16"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="50" cy="50" r="15" fill={label} />
            </motion.g>
          </motion.g>
        )}
      </AnimatePresence>
      <circle cx="50" cy="50" r="2.4" fill="#f0e8dd" />
      {/* tonearm: parked off the platter, swung onto the grooves when loaded */}
      <circle cx="122" cy="16" r="7" fill="#1b1d1a" fillOpacity="0.12" />
      {/* Plain CSS: motion rewrites SVG transform-origin to the bounding-box centre. */}
      <g
        className="transition-transform duration-700 ease-in-out motion-reduce:transition-none"
        style={{
          transform: `rotate(${loaded ? 32 : 0}deg)`,
          transformBox: "view-box",
          transformOrigin: "122px 16px",
        }}
      >
        <path
          d="M122 16 L122 70 L117 78"
          fill="none"
          stroke="#8d8a84"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="112"
          y="76"
          width="8"
          height="5"
          rx="1"
          fill="#1b1d1a"
          transform="rotate(-30 116 78.5)"
        />
      </g>
      <circle
        cx="122"
        cy="16"
        r="3.4"
        fill="#f0e8dd"
        stroke="#1b1d1a"
        strokeOpacity="0.3"
        strokeWidth="0.6"
      />
      {/* speed knob and power light */}
      <circle cx="124" cy="86" r="4.5" fill="#1b1d1a" fillOpacity="0.12" />
      <circle
        cx="108"
        cy="88"
        r="1.6"
        fill={spinning ? "#ff3f1a" : "#1b1d1a"}
        fillOpacity={spinning ? 1 : 0.2}
      />
    </svg>
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

  // One <audio> reused across records, torn down so none outlives the page.
  useEffect(() => {
    const el = audioRef.current;
    return () => {
      el?.pause();
    };
  }, []);

  function land(track: Track) {
    // Bumped per landing, so a stale play() rejection cannot clobber a live track.
    const gen = ++landingRef.current;
    const el = audioRef.current;

    setNowPlaying(track);

    if (!track.audio) {
      // Stop whatever is playing; toggle() cannot pause a track with no audio.
      el?.pause();
      setPlaying(false);
      // Only apologise when there is no Spotify player to fall back on either.
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
    <div className="flex flex-col gap-12">
      {/* The player leads: reaching it should not mean scrolling past the crate. */}
      <div>
        <div
          ref={platterRef}
          className="sticky top-24 z-20 -mx-6 max-w-lg bg-cream px-6 pb-4 sm:-mx-10 sm:px-10 lg:static lg:mx-0 lg:px-0"
        >
          <div className="flex items-center gap-5">
            {/* The deck itself: tap to pause/resume when there is a local MP3. */}
            <div
              onClick={toggle}
              // Only a control with a local MP3 — Spotify owns its own button.
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
              className={`aspect-[7/5] w-32 shrink-0 drop-shadow-[0_8px_14px_rgba(27,29,26,0.18)] sm:w-44 ${nowPlaying?.audio ? "cursor-pointer" : ""}`}
            >
              <Deck label={nowPlaying?.label ?? null} spinning={playing} />
            </div>
            <div className="min-w-0">
              {nowPlaying ? (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-orange">
                    {playing ? "Now playing" : "Cued"}
                  </p>
                  <p className="mt-1 font-display text-2xl tracking-tight">
                    {nowPlaying.title}
                  </p>
                  <p className="font-mono text-[11px] text-mirage/50">
                    {nowPlaying.artist}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mirage/40">
                    Deck idle
                  </p>
                  <p className="mt-1 font-display text-2xl tracking-tight text-mirage/70">
                    Pick a record
                  </p>
                  <p className="font-mono text-[11px] text-mirage/45">
                    Anything from the crate below will do.
                  </p>
                </>
              )}
            </div>
          </div>
          {nowPlaying && (
            <>
              {/* `key` remounts per track; swapping `src` pushes iframe history entries. */}
              {embed ? (
                <iframe
                  key={embed}
                  src={embed}
                  title={`${nowPlaying.title} by ${nowPlaying.artist} on Spotify`}
                  height={152}
                  loading="lazy"
                  // Mobile blocks playback in a cross-origin frame without `autoplay`.
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="mt-4 w-full rounded-xl border-0"
                />
              ) : nowPlaying.spotify ? (
                <a
                  href={nowPlaying.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block border-b border-mirage/25 font-mono text-[11px] text-mirage/55 transition-colors hover:border-orange hover:text-orange"
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
          )}
        </div>

        <audio
          ref={audioRef}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        />
      </div>
      {/* the crate */}
      <div>
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-mirage/40">
          Drop a record on the player — or just click one
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
                // Also a button: drag is unusable by keyboard. The ref guards the extra click.
                role="button"
                tabIndex={0}
                aria-label={`Play ${t.title} by ${t.artist}`}
                // motion's tap: the drag gesture preventDefaults the native click away.
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
                  // Hit-test the pointer in viewport space; `info.point` is off by the scroll.
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
                // `relative` is load-bearing: z-index is ignored on static elements.
                className="relative aspect-square cursor-grab touch-none"
                style={{
                  filter: "drop-shadow(0 10px 18px rgba(27,29,26,0.28))",
                }}
              >
                <Record label={t.label} spinning={false} />
              </motion.div>
              {/* Wraps rather than truncating; a clipped title reads as a bug. */}
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
    </div>
  );
}
