import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client";
import { POSTS_QUERY } from "@/lib/sanity/queries";
import type { PostListItem } from "@/lib/sanity/types";

const BASE_URL = "https://paardhiv.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/travel`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/music`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/sneakers`, changeFrequency: "yearly", priority: 0.5 },
  ];

  if (!client) return staticRoutes;

  const posts: PostListItem[] = await client.fetch(POSTS_QUERY);
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug.current}`,
    lastModified: post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
