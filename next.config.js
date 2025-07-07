/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_MCP_SERVER_URL: process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3001',
  },
  // Handle API routes
  async rewrites() {
    return [
      {
        source: '/api/mcp/:path*',
        destination: `${process.env.NEXT_PUBLIC_MCP_SERVER_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig; 