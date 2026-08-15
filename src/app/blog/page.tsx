import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { client } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { POSTS_QUERY } from "@/lib/sanity/queries";
import type { PostListItem } from "@/lib/sanity/types";
import { isSanityConfigured } from "../../../sanity/env";

export const metadata: Metadata = {
  title: "Blog — Paardhiv Sarakam",
  description: "Notes on building, shipping, and the occasional cube solve.",
};

export const revalidate = 60;

async function getPosts(): Promise<PostListItem[]> {
  if (!client) return [];
  return client.fetch(POSTS_QUERY);
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col bg-chalk text-mirage">
        <section className="px-6 pt-32 pb-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-jade">
              Writing
            </p>
            <h1 className="font-display text-5xl tracking-tight sm:text-6xl">
              The Blog
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-mirage/70">
              Notes on building, shipping, and the occasional cube solve.
            </p>

            {!isSanityConfigured && (
              <div className="mt-16 border border-dashed border-mirage/25 bg-mirage/[0.03] px-6 py-10 font-mono text-sm text-mirage/60">
                <p className="font-bold text-mirage">
                  Blog isn&apos;t connected yet.
                </p>
                <p className="mt-2">
                  Run <code className="text-orange">npx sanity init</code>,
                  drop the project ID into{" "}
                  <code className="text-orange">.env.local</code>, then write
                  your first post at{" "}
                  <code className="text-orange">/studio</code>.
                </p>
              </div>
            )}

            {isSanityConfigured && posts.length === 0 && (
              <div className="mt-16 border border-dashed border-mirage/25 bg-mirage/[0.03] px-6 py-10 font-mono text-sm text-mirage/60">
                No posts yet — write your first one at{" "}
                <Link href="/studio" className="text-orange underline">
                  /studio
                </Link>
                .
              </div>
            )}

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group block border border-mirage/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
                >
                  {post.coverImage && (
                    <div className="relative mb-4 aspect-[16/9] overflow-hidden bg-chalk">
                      <Image
                        src={urlForImage(post.coverImage)
                          .width(600)
                          .height(340)
                          .url()}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <p className="font-mono text-[11px] uppercase tracking-widest text-mirage/40">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <h2 className="mt-2 font-display text-2xl group-hover:text-orange">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm leading-relaxed text-mirage/65">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
