import type { Metadata } from "next";
import Image from "next/image";
import { CollectionPage } from "@/components/collection-page";
import { sneakers } from "@/content/collections";

export const metadata: Metadata = {
  title: "Sneakers — Paardhiv Sarakam",
  description: "The shelf: pairs collected, worn, and occasionally retired.",
};

export default function SneakersPage() {
  return (
    <CollectionPage
      eyebrow="The Shelf"
      title="Sneakers"
      intro="Pairs collected, worn, and occasionally retired to the box they came in. More of them than the shelf can honestly hold."
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {sneakers.map((s, i) => (
          <article key={s.id} className="group">
            {/* the box lid the pair sits on */}
            <div
              className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-mirage/12"
              style={{
                background: i % 2 ? "#f4ecdd" : "#eee7f0",
                backgroundImage:
                  "repeating-linear-gradient(112deg, rgba(27,29,26,0.035) 0 2px, transparent 2px 6px)",
              }}
            >
              {s.photo ? (
                <Image
                  src={s.photo}
                  alt={`${s.brand} ${s.name}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain p-6 transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-[1.06]"
                />
              ) : (
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mirage/35">
                  Photo
                </span>
              )}
              <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-mirage/35">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-mirage/40">
              {s.brand} · {s.year}
            </p>
            <h2 className="mt-2 font-display text-2xl tracking-tight">
              {s.name}
            </h2>
            <p className="mt-1 font-mono text-[11px] text-mirage/50">
              {s.colourway}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mirage/65">
              {s.note}
            </p>
          </article>
        ))}
      </div>
    </CollectionPage>
  );
}
