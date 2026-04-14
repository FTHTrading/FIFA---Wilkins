/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@wilkins/ui', '@wilkins/lib', '@wilkins/types', '@wilkins/config', '@wilkins/i18n'],
  images: {
    domains: ['storage.googleapis.com', 'cdn.wilkinsmedia.com'],
  },
};

module.exports = nextConfig;
