import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../../../sanity/env";

// `createClient` throws immediately if projectId is empty, so only
// construct it once a real Sanity project is connected. Blog pages check
// `isSanityConfigured` before ever touching `client`.
export const client: SanityClient | null = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;
