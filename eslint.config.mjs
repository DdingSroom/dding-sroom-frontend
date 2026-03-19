import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  {
    ignores: ['node_modules/', '.next/'],
  },

  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript').map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
  })),
  prettierRecommended,

  // 공통 규칙
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      '@next/next/no-img-element': 'warn',

      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-var': 'error',

      'arrow-body-style': ['warn', 'as-needed'],
      'react/self-closing-comp': ['warn', { component: true, html: true }],
      'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],

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

      // 기본 no-unused-vars를 끄고 unused-imports 플러그인으로 대체
      // JS/TS 모두 unused-imports/no-unused-vars가 미사용 변수를 검사하므로
      // 빌트인 규칙과의 중복 경고를 방지하기 위해 off 처리
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
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

  // JS/JSX: 타입 검사 제외, 미선언 변수 검사 활성화
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'no-undef': 'error',
    },
  },

  // TS/TSX: TypeScript 전용 규칙
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

export default config;
