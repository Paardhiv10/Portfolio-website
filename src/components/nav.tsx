"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { site } from "@/content/site";
import { useSound } from "@/lib/sound-context";

const LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  // Footer is otherwise only reachable by scrolling to the bottom.
  { href: "/#footer", label: "Contact" },
];

export function Nav() {
  const { muted, toggleMuted, play } = useSound();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Keyed off intent, not a colour class, so recolouring cannot break it.
      const darkSections = document.querySelectorAll("[data-nav-dark]");
      const navTop = 16;
      const navBottom = 72;
      let overDark = false;

      for (let i = 0; i < darkSections.length; i++) {
        const rect = darkSections[i].getBoundingClientRect();
        if (rect.top <= navBottom && rect.bottom >= navTop) {
          overDark = true;
          break;
        }
      }

      setIsDarkBg(overDark);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = isDarkBg ? "text-white" : "text-mirage";
  const borderColor = isDarkBg ? "border-white/25" : "border-mirage/25";

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative h-14">
          <div
            // Full width on phones; from md the links are inside and it can shrink.
            className={`relative mx-auto flex h-14 w-full items-center justify-between gap-6 rounded-full border px-6 transition-colors duration-300 md:w-fit md:gap-10 md:px-7 ${
              isDarkBg ? "border-white/25" : "border-white/40"
            } ${textColor}`}
            style={{
              // The glass thins over dark sections so white nav text still clears it.
              background: isDarkBg
                ? "rgba(255, 255, 255, 0.10)"
                : "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              boxShadow: isDarkBg
                ? "inset 0 1px 0 rgba(255,255,255,0.28), 0 10px 30px rgba(0,0,0,0.28)"
                : "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.06), 0 10px 30px rgba(27,29,26,0.18)",
            }}
          >
            <Link
              href="/#home"
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
              className={`font-display text-xl leading-none transition-colors hover:text-orange ${textColor}`}
            >
              PS.
            </Link>

            <nav
              className={`hidden items-center gap-7 font-mono text-[11px] uppercase tracking-widest transition-colors duration-300 md:flex ${textColor}`}
            >
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => play("hover")}
                  onClick={() => play("click")}
                  className="transition-colors hover:text-orange"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={!muted}
                aria-label={muted ? "Unmute sound" : "Mute sound"}
                onClick={toggleMuted}
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-2xl border transition-colors hover:border-orange hover:text-orange ${borderColor} ${textColor}`}
              >
                {muted ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path
                      d="M11 5 6 9H3v6h3l5 4V5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 9l5 6M21 9l-5 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path
                      d="M11 5 6 9H3v6h3l5 4V5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>

              {/* Plain anchor: the resume is on Drive, so it opens in its own tab. */}
              <a
                href={site.resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => play("hover")}
                onClick={() => play("click")}
                className={`hidden rounded-2xl border px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors hover:border-orange hover:text-orange sm:block ${borderColor} ${textColor}`}
              >
                Resume
              </a>

              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-2xl border transition-colors hover:border-orange hover:text-orange md:hidden ${borderColor} ${textColor}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden
                >
                  {menuOpen ? (
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  ) : (
                    <path
                      d="M4 7h16M4 12h16M4 17h16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              // Opaque: it only lives while the menu is open, so blur buys nothing.
              className={`mt-2 rounded-2xl border border-white/40 transition-colors duration-300 md:hidden ${textColor}`}
              style={{
                background:
                  "linear-gradient(to bottom, rgba(244,245,248,0.7), rgba(230,232,239,0.7))",
                backdropFilter: "blur(24px)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 34px rgba(27,29,26,0.25)",
              }}
            >
              <nav className="flex flex-col px-5 py-1 font-mono text-sm uppercase tracking-widest">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      play("click");
                      setMenuOpen(false);
                    }}
                    className={`border-b py-3 transition-colors last:border-b-0 hover:text-orange ${isDarkBg ? "border-white/10" : "border-mirage/12"}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href={site.resumeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    play("click");
                    setMenuOpen(false);
                  }}
                  className={`py-3 hover:text-orange sm:hidden ${textColor}`}
                >
                  Resume →
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
