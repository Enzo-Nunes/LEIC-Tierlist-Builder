/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  // Use basePath and assetPrefix in production (for GitHub Pages)
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/LEIC-Tierlist',
    assetPrefix: '/LEIC-Tierlist/',
  }),
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
