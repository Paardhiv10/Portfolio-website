import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { flights } from "@/content/collections";

export const metadata: Metadata = {
  title: "Travel — Paardhiv Sarakam",
  description: "Tail fins: the rudders I've actually flown behind.",
};

export const dynamic = "force-static";

/**
 * One airline's vertical stabilizer, drawn in its livery colours.
 *
 * Same geometry as the tail fin in the Interests sentence, so the grid reads as
 * a set of the same object rather than a set of logos — and drawing them means
 * no airline artwork is reproduced.
 */
function Fin({
  stabilizer,
  rudder,
  mark,
}: {
  stabilizer: string;
  rudder: string;
  mark: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      {/* rudder — the hinged trailing section */}
      <path
        d="M65 12 L83 12 L81 84 L63 84 Z"
        fill={rudder}
        stroke="#1b1d1a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* fixed stabilizer */}
      <path
        d="M9 84 L53 12 L66 12 L64 84 Z"
        fill={stabilizer}
        stroke="#1b1d1a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* livery chevron */}
      <path d="M24 70 L48 30 L57 30 L33 70 Z" fill={mark} fillOpacity="0.9" />
      {/* hinge */}
      <path
        d="M65 13 L63 83"
        stroke="#1b1d1a"
        strokeWidth="1.2"
        strokeOpacity="0.45"
        strokeDasharray="3 3"
      />
      {/* the tailplane it stands on */}
      <path d="M4 84 L92 84 L92 92 L4 92 Z" fill="#1b1d1a" />
    </svg>
  );
}

export default function TravelPage() {
  return (
    <CollectionPage
      eyebrow="Logged"
      title="Tail Fins"
      intro="Every rudder I've actually flown behind. Drawn rather than photographed — a fin is a shape, and the shape is the interesting part."
    >
      {/* the subtle grid the fins stand on, like a spotter's log sheet */}
      <div
        className="relative border border-mirage/12 p-6 sm:p-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(27,29,26,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(27,29,26,0.055) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      >
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {flights.map((f) => (
            <figure key={f.id} className="group text-center">
              <div className="mx-auto aspect-square w-full max-w-[140px] transition-transform duration-300 group-hover:-translate-y-1.5">
                <Fin {...f.fin} />
              </div>
              <figcaption className="mt-4">
                <p className="font-display text-lg leading-tight tracking-tight">
                  {f.airline}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-mirage/45">
                  {f.code} · {f.year}
                </p>
                <p className="mt-1 font-mono text-[11px] text-mirage/55">
                  {f.route}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </CollectionPage>
  );
}
