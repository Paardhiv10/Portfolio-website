import type { PortableTextBlock } from "next-sanity";

export type PostListItem = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  coverImage?: { asset?: { _ref: string } };
  publishedAt: string;
  tags?: string[];
};

export type Post = PostListItem & {
  body?: PortableTextBlock[];
};
