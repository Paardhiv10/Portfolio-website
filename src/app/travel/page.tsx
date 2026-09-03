import type { Metadata } from "next";
import Image from "next/image";
import { CollectionPage } from "@/components/collection-page";
import { flights } from "@/content/collections";

export const metadata: Metadata = {
  title: "Travel",
  description:
    "Tail fins: every rudder I have actually flown behind, cut out and set at the same scale.",
  alternates: { canonical: "/travel" },
  openGraph: {
    title: "Travel — Paardhiv Sarakam",
    description:
      "Tail fins: every rudder I have actually flown behind, cut out and set at the same scale.",
    url: "/travel",
    type: "website",
  },
};

export const dynamic = "force-static";

export default function TravelPage() {
  return (
    <CollectionPage
      eyebrow="Logged"
      title="Tail Fins"
      intro="Every rudder I've actually flown behind, cut out and set at the same scale so the shapes can be compared."
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
              <div className="relative mx-auto aspect-square w-full max-w-[150px] transition-transform duration-300 group-hover:-translate-y-1.5">
                <Image
                  src={f.fin}
                  alt={`${f.airline} tail fin`}
                  fill
                  sizes="150px"
                  className="object-contain object-bottom"
                />
              </div>
              <figcaption className="mt-4 font-display text-lg leading-tight tracking-tight">
                {f.airline}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </CollectionPage>
  );
}
