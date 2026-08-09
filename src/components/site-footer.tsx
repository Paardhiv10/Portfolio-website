"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { GrainOverlay } from "@/components/grain-overlay";
import { site } from "@/content/site";
import { useSound } from "@/lib/sound-context";

/** Aged-paper fill used by the stamps. */
const PAPER = "#efe3cd";

/** Falcon carrying a wax-sealed letter — the "send word" messenger. */
function CarrierFalcon() {
  return (
    <Image
      src="/falcon_email.png"
      alt="Send email"
      width={1536}
      height={1024}
      // The source is 1536px wide but the column caps at 340px, so tell the
      // optimiser the real display size — otherwise it ships the full 2.5MB
      // asset to render a thumbnail.
      sizes="340px"
      // No rounding or drop shadow: this cut-out is transparent, so both would
      // only describe a rectangle that isn't there. The old photo had an opaque
      // background and needed them.
      className="h-auto w-full transition-transform group-hover:scale-[1.02]"
    />
  );
}

/** A perforated postage stamp wrapping each social link. */
function Stamp({
  label,
  handle,
  href,
  onHover,
  onClick,
}: {
  label: string;
  handle: string;
  href: string;
  onHover: () => void;
  onClick: () => void;
}) {
  return (
    <motion.a
      href={href === "REPLACE_ME" ? "#" : href}
      onMouseEnter={onHover}
      onClick={onClick}
      whileHover={{ y: -5, rotate: 0 }}
      className="group relative block px-3 py-6 text-center text-mirage"
      style={{
        background: PAPER,
        maskImage:
          "radial-gradient(circle at 0 0, transparent 6px, black 6.5px), radial-gradient(circle at 100% 0, transparent 6px, black 6.5px), radial-gradient(circle at 0 100%, transparent 6px, black 6.5px), radial-gradient(circle at 100% 100%, transparent 6px, black 6.5px)",
        WebkitMaskImage:
          "radial-gradient(circle at 0 0, transparent 6px, black 6.5px), radial-gradient(circle at 100% 0, transparent 6px, black 6.5px), radial-gradient(circle at 0 100%, transparent 6px, black 6.5px), radial-gradient(circle at 100% 100%, transparent 6px, black 6.5px)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-2 border border-dashed border-mirage/30"
      />
      <span className="relative block font-display text-2xl leading-none tracking-wide">
        {label}
      </span>
      <span className="relative mt-2 block font-mono text-[11px] text-mirage/55">
        {handle}
      </span>
    </motion.a>
  );
}

export function SiteFooter() {
  const { play } = useSound();

  const socials = [
    { label: "GitHub", handle: "/code", href: site.social.github },
    { label: "LinkedIn", handle: "/work", href: site.social.linkedin },
    { label: "Twitter", handle: "/thoughts", href: site.social.twitter },
  ];

  return (
    <footer
      id="footer"
      className="relative overflow-hidden bg-black px-6 py-20 text-chalk sm:px-10 lg:px-16"
    >
      <GrainOverlay opacity={0.05} />

      <div className="relative mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-orange"
        >
          Get in Touch
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-4xl tracking-wide sm:text-5xl"
        >
          Send Word
        </motion.h2>

        {/* one row: the falcon on the left, stamps in two columns on the right */}
        <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* email — the carrier falcon */}
          <motion.a
            href={`mailto:${site.email}`}
            onMouseEnter={() => play("hover")}
            onClick={() => play("click")}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ x: 6, y: -5 }}
            className="group block max-w-[340px]"
          >
            <CarrierFalcon />
            <p className="mt-3 font-mono text-xs text-chalk/40 transition-colors group-hover:text-orange">
              {site.email}
            </p>
          </motion.a>

          {/* socials — stamps, two per row */}
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-chalk/40">
              Elsewhere
            </p>
            <div className="grid max-w-[420px] grid-cols-3 gap-3">
              {socials.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 14, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                >
                  <Stamp
                    label={s.label}
                    handle={s.handle}
                    href={s.href}
                    onHover={() => play("hover")}
                    onClick={() => play("click")}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 border-t border-chalk/10 pt-6 text-center font-mono text-[11px] text-chalk/35 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Paardhiv Sarakam.</p>
          <p>Built with too many small decisions.</p>
        </div>
      </div>
    </footer>
  );
}
