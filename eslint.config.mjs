import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const __dirname = dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  prettierRecommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      'no-undef': 'off',
      '@next/next/no-img-element': 'off',
      'arrow-body-style': ['error', 'always'],

      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // 1. 라이브러리: node 빌트인, react, next, 외부 패키지
            ['^node:', '^react', '^next', '^@?\\w'],
            // 2. 컴포넌트 (@components)
            ['^@components(/|$)'],
            // 3. 나머지 내부 alias (@api, @constants, @hooks, @stores, @utils)
            ['^@(api|constants|hooks|stores|utils)(/|$)'],
            // 4. 상위 디렉토리 (../)
            ['^\\.\\.(?!/?$)', '^\\.\\./'],
            // 5. 같은/하위 디렉토리 (./)
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // 6. Side effect imports (e.g. import './styles.css')
            ['^\\u0000'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',

      // 사용하지 않는 import 제거
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'no-undef': 'error',
    },
  },
  {
    ignores: ['node_modules/', '.next/'],
  },
];

export default config;
