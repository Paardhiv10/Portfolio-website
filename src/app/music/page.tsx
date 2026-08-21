import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { Turntable } from "@/components/turntable";
import { tracks } from "@/content/collections";

export const metadata: Metadata = {
  title: "Music — Paardhiv Sarakam",
  description: "The crate: records on heavy rotation. Drop one on the platter.",
};

export default function MusicPage() {
  return (
    <CollectionPage
      eyebrow="On Rotation"
      title="The Crate"
      intro="Far more music than is strictly reasonable. Pull a record out of the crate, drop it on the platter, and it plays."
    >
      <Turntable tracks={tracks} />
    </CollectionPage>
  );
}
