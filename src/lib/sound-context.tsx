"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Sounds backed by a real recording rather than synthesis. `paper` is the
 * receipt unroll; `sticky` is the peel when a project note is clicked.
 */
const FILE_SOUNDS = {
  paper: { src: "/audio/paper.mp3", volume: 0.55 },
  sticky: { src: "/audio/sticky-note.mp3", volume: 0.6 },
} as const;

type FileSound = keyof typeof FILE_SOUNDS;
type SoundKind = "hover" | "click" | FileSound;

type SoundContextValue = {
  muted: boolean;
  toggleMuted: () => void;
  play: (kind: SoundKind) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

const STORAGE_KEY = "ps-sound-muted";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const filesRef = useRef<Partial<Record<FileSound, HTMLAudioElement>>>({});

  useEffect(() => {
    const els = Object.entries(FILE_SOUNDS).map(([kind, { src }]) => {
      const el = new Audio(src);
      el.preload = "auto";
      // preload="auto" alone is only a hint, and Chrome defers the fetch for a
      // detached element until something forces it — measured readyState 0
      // with the network still opening at the moment of the first click, which
      // makes that first sound arrive late or not at all. load() commits to it.
      el.load();
      filesRef.current[kind as FileSound] = el;
      return el;
    });
    // Only stop playback on teardown — deliberately do not empty the ref.
    // Emptying it means any teardown that isn't immediately followed by a
    // remount (a hot reload, say) leaves the app permanently silent, with the
    // handlers still firing into a missing element and no error to show for it.
    return () => els.forEach((el) => el.pause());
  }, []);

  useEffect(() => {
    // Reading localStorage during the initial render would desync server
    // and client output (SSR has no window), so the default stays `true`
    // and this syncs the real value in after hydration instead.
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored !== null) setMuted(stored === "1");
  }, []);

  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  // Unlock audio on the first real gesture anywhere on the page.
  //
  // A browser keeps an AudioContext suspended, and refuses to play a media
  // element, until the document has seen genuine user activation — and moving
  // the pointer does not count. Someone arriving with sound already enabled
  // (the preference persists) would hover a note, and `play` would create the
  // context in that suspended state and run the oscillator into silence. It
  // stayed silent until they happened to click something. Toggling mute off
  // and on appeared to fix it only because the toggle was itself the gesture.
  //
  // Creating the context inside the handler matters: made during a gesture it
  // starts out running, where one made earlier would need resuming.
  useEffect(() => {
    const unlock = () => {
      getCtx();
      for (const el of Object.values(filesRef.current)) el?.load();
    };
    const opts = { once: true, passive: true } as const;
    window.addEventListener("pointerdown", unlock, opts);
    window.addEventListener("keydown", unlock, opts);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [getCtx]);

  const play = useCallback(
    (kind: SoundKind) => {
      if (muted) return;
      const ctx = getCtx();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (kind in FILE_SOUNDS) {
        const fileKind = kind as FileSound;
        const el = filesRef.current[fileKind];
        if (!el) return;
        el.currentTime = 0;
        el.volume = FILE_SOUNDS[fileKind].volume;
        void el.play().catch(() => {
          /* autoplay policy — harmless, the toggle is a user gesture */
        });
        return;
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (kind === "hover") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(820, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.07);
      } else {
        osc.type = "square";
        osc.frequency.setValueAtTime(560, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.08);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.11);
      }
    },
    [muted, getCtx],
  );

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      if (!next) {
        getCtx(); // unlock audio context on the gesture that unmutes
        // Unmuting is a real user gesture, which is exactly when a browser
        // will honour a media fetch it had been holding back. Warming the
        // recordings here means the first note click is instant.
        for (const el of Object.values(filesRef.current)) el?.load();
      }
      return next;
    });
  }, [getCtx]);

  return (
    <SoundContext.Provider value={{ muted, toggleMuted, play }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
