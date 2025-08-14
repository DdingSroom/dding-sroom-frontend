/** @type {import('next').NextConfig} */
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  pageExtensions: ['js', 'jsx', 'html'],

  // 프로덕션 빌드에서만 console 제거 (error는 유지)
  compiler: {
    removeConsole: isProd ? { exclude: ['error'] } : false,
  },

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
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
    };

    config.module.rules.push({
      test: /\.svg$/,
      include: path.join(__dirname, './public/static/icons'),
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
