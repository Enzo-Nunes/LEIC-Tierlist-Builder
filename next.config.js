/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: '/LEIC-Tierlist',
  assetPrefix: '/LEIC-Tierlist/',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
