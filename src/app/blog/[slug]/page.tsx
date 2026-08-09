import { PortableText } from "next-sanity";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { client } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/lib/sanity/queries";
import type { Post } from "@/lib/sanity/types";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<Post | null> {
  if (!client) return null;
  return client.fetch(POST_QUERY, { slug });
}

export async function generateStaticParams() {
  if (!client) return [];
  const slugs: string[] = await client.fetch(POST_SLUGS_QUERY);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — Paardhiv Sarakam`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col bg-chalk text-mirage">
        <article className="px-6 pt-32 pb-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-mirage/40">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="font-display text-4xl tracking-wide sm:text-5xl">
              {post.title}
            </h1>

            {post.coverImage && (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden bg-white">
                <Image
                  src={urlForImage(post.coverImage).width(1200).height(675).url()}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="prose mt-10 max-w-none prose-headings:font-display prose-headings:tracking-wide prose-a:text-orange">
              {post.body && <PortableText value={post.body} />}
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
