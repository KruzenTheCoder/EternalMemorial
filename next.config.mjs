/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@livekit/components-react",
    "@livekit/components-styles",
    "livekit-client",
    "three",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
