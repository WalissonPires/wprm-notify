const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['p-queue', 'eventemitter3', 'p-timeout']
}

module.exports = withPWA(nextConfig);
