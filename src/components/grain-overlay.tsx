/**
 * Tiny tiled noise texture, generated once as an inline SVG data URI —
 * no image request, no canvas re-render cost. Sits above the section
 * background at low opacity so solid colors don't read as flat/clumsy.
 */
export function GrainOverlay({
  opacity = 0.05,
  className = "",
}: {
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
        mixBlendMode: "overlay",
      }}
    />
  );
}
