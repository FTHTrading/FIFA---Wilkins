/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: [
    '@wilkins/ui',
    '@wilkins/lib',
    '@wilkins/types',
    '@wilkins/config',
    '@wilkins/i18n',
    '@wilkins/emergency',
  ],
};

module.exports = nextConfig;
