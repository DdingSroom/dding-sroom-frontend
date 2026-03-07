/** @type {import('next').NextConfig} */
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'html'],

  // 프로덕션 빌드에서 모든 console.* 제거
  compiler: {
    removeConsole: isProd,
  },

  // 프로덕션에서 소스맵 노출 방지
  productionBrowserSourceMaps: false,

  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
        },
      },
    },
  },

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@api': path.resolve(__dirname, './src/app/api'),
      '@components': path.resolve(__dirname, './src/components'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@stores': path.resolve(__dirname, './src/stores'),
    };

    config.module.rules.push({
      test: /\.svg$/,
      include: path.join(__dirname, './public/static/icons'),
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
