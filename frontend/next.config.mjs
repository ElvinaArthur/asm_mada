/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Only treat .tsx and .ts files as pages — this excludes .jsx/.js files in src/pages/
  // from being treated as Pages Router routes, while App Router app/**/page.tsx still works
  pageExtensions: ['tsx', 'ts'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.vercel-storage.com' },
      { protocol: 'https', hostname: 'asm-mada.onrender.com' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', 'sharp'],
  },
};

export default nextConfig;
