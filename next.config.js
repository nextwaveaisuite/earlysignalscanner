/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { serverActions: { allowedOrigins: ["*"] } },
  webpack: (config) => {
    // Allow imports like "@/components/..." and "@/lib/..."
    config.resolve.alias['@'] = __dirname;
    return config;
  },
};

module.exports = nextConfig;
