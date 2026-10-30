/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // We run ESLint independently
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Strictly fail build on any TypeScript typecheck errors
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

