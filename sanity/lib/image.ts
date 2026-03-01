// Sanity stores images as references, not URLs.
// This helper converts a Sanity image reference into an actual URL.
//
// Example — Sanity stores this:
//   { _type: "image", asset: { _ref: "image-abc123-800x600-jpg" } }
//
// imageUrl(image).width(800).url() returns:
//   "https://cdn.sanity.io/images/yourproject/production/abc123-800x600.jpg"

import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./client";

// Create a URL builder bound to your project
const builder = imageUrlBuilder(client);

export function imageUrl(source: SanityImageSource) {
  return builder.image(source);
}
