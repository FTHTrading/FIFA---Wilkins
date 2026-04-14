/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: [
    '@wilkins/ui',
    '@wilkins/lib',
    '@wilkins/types',
    '@wilkins/config',
    '@wilkins/analytics',
    '@wilkins/campaigns',
    '@wilkins/auth',
  ],
};

module.exports = nextConfig;
