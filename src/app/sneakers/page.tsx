import type { Metadata } from "next";
import Image from "next/image";
import { CollectionPage } from "@/components/collection-page";
import { sneakers } from "@/content/collections";

export const metadata: Metadata = {
  title: "Sneakers",
  description:
    "The shelf: pairs collected, worn, and occasionally retired to the box they came in.",
  alternates: { canonical: "/sneakers" },
  openGraph: {
    title: "Sneakers — Paardhiv Sarakam",
    description:
      "The shelf: pairs collected, worn, and occasionally retired to the box they came in.",
    url: "/sneakers",
    type: "website",
  },
};

export default function SneakersPage() {
  return (
    <CollectionPage
      eyebrow="The Shelf"
      title="Sneakers"
      intro="Pairs collected, worn, and occasionally retired to the box they came in."
    >
      {/* Centred column: left-hugging the wide section stranded the right side. */}
      <div className="mx-auto flex max-w-xl flex-col gap-12">
        {sneakers.map((s) => (
          <article
            key={s.id}
            className="group flex flex-col items-center gap-6 sm:flex-row sm:gap-10"
          >
            {/* Just the shoe: multiply-blending the white shot into the page's cream. */}
            <div className="relative h-24 w-40 shrink-0 sm:h-28 sm:w-48">
              {s.photo ? (
                <Image
                  src={s.photo}
                  alt={`${s.brand} ${s.name}`}
                  fill
                  sizes="200px"
                  className="object-contain mix-blend-multiply transition-transform duration-300 ease-out group-hover:scale-[1.15]"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center font-mono text-[10px] uppercase tracking-[0.25em] text-mirage/35">
                  Photo
                </span>
              )}
            </div>

            {/* w-full, or each card shrink-wraps and starts at its own x. */}
            <div className="w-full text-center sm:flex-1 sm:text-left">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mirage/40">
                {s.brand}
                {s.year ? ` · ${s.year}` : ""}
              </p>
              <h2 className="mt-2 font-display text-3xl tracking-tight">
                {s.name}
              </h2>
              <p className="mt-1 font-mono text-[11px] text-mirage/50">
                {s.colourway}
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-mirage/65 sm:mx-0">
                {s.note}
              </p>
            </div>
          </article>
        ))}
      </div>
    </CollectionPage>
  );
}
