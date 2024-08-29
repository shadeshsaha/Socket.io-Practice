/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true,
    swcPlugins: [["next-superjson-plugin", {}]],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
    ],

    // domains: [
    //   "res.cloudinary.com",
    //   "avatars.githubusercontent.com",
    //   "lh3.googleusercontent.com",
    // ],
  },
};

export default nextConfig;
