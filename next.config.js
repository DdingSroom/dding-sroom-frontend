/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  pageExtensions: ['js', 'jsx', 'html'],
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
