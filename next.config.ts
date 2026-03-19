import type { NextConfig } from 'next';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'html'],

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
    config.module.rules.push({
      test: /\.svg$/,
      include: path.join(__dirname, './public/static/icons'),
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
