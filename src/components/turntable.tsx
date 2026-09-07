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
          <div className="min-h-[76px]">
            {nowPlaying ? (
              <>
                <div className="flex items-center gap-4">
                  {/* All that is left of the deck: it spins whenever audio runs. */}
                  <div
                    onClick={toggle}
                    // Only a control with a local MP3 — Spotify owns its own button.
                    {...(nowPlaying.audio
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
                    className={`h-16 w-16 shrink-0 sm:h-20 sm:w-20 ${nowPlaying.audio ? "cursor-pointer" : ""}`}
                  >
                    <Record label={nowPlaying.label} spinning={playing} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-orange">
                      {playing ? "Now playing" : "Cued"}
                    </p>
                    <p className="mt-1 font-display text-2xl tracking-tight">
                      {nowPlaying.title}
                    </p>
                    <p className="font-mono text-[11px] text-mirage/50">
                      {nowPlaying.artist}
                    </p>
                  </div>
                </div>
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
