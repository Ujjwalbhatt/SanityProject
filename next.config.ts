import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix styled-components SSR hydration mismatch.
  // @sanity/ui (used by VisualEditing) uses styled-components internally.
  // Without this, server and client generate different class names → hydration error.
  compiler: {
    styledComponents: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
