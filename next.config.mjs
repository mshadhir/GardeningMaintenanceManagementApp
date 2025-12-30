/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@react-google-maps/api'
    ]
  }
};

export default nextConfig;
