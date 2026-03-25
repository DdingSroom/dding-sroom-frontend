/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* 배경 */
        surface: {
          DEFAULT: 'var(--color-surface)',
          page: 'var(--color-surface-page)',
          subtle: 'var(--color-surface-subtle)',
          muted: 'var(--color-surface-muted)',
          admin: 'var(--color-surface-admin)',
          'admin-header': 'var(--color-surface-admin-header)',
          neutral: 'var(--color-surface-neutral)',
          suggest: 'var(--color-surface-suggest)',
          card: 'var(--color-surface-card)',
        },
        /* 텍스트 */
        content: {
          DEFAULT: 'var(--color-content)',
          secondary: 'var(--color-content-secondary)',
          muted: 'var(--color-content-muted)',
          time: 'var(--color-content-time)',
          base: 'var(--color-content-base)',
          tertiary: 'var(--color-content-tertiary)',
        },
        /* Primary */
        primary: {
          DEFAULT: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
          dark: 'var(--color-primary-dark)',
          'dark-hover': 'var(--color-primary-dark-hover)',
          light: 'var(--color-primary-light)',
          lighter: 'var(--color-primary-lighter)',
          lightest: 'rgb(var(--color-primary-lightest-rgb) / <alpha-value>)',
          bg: 'var(--color-primary-bg)',
          disabled: 'var(--color-primary-disabled)',
        },
        /* 커뮤니티 */
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
        },
        /* Login Banner */
        'login-btn': {
          DEFAULT: 'var(--color-login-btn)',
          hover: 'var(--color-login-btn-hover)',
        },
        /* border */
        line: {
          DEFAULT: 'var(--color-line)',
          input: 'var(--color-line-input)',
        },
        /* Status */
        status: {
          reserved: 'var(--color-status-reserved)',
          inactive: 'var(--color-status-inactive)',
          past: 'var(--color-status-past)',
          display: 'var(--color-status-display)',
        },
        /* Info Link */
        'info-link': 'var(--color-info-link)',
        /* Error */
        error: {
          DEFAULT: 'var(--color-error)',
          bg: 'var(--color-error-bg)',
          'bg-hover': 'var(--color-error-bg-hover)',
        },
        /* Warning */
        warning: {
          DEFAULT: 'rgb(var(--color-warning-rgb) / <alpha-value>)',
          bg: 'var(--color-warning-bg)',
          muted: 'var(--color-warning-muted)',
        },
        /* Tag */
        tag: {
          'info-bg': 'var(--color-tag-info-bg)',
          'info-text': 'var(--color-tag-info-text)',
          'warning-bg': 'var(--color-tag-warning-bg)',
          'warning-text': 'var(--color-tag-warning-text)',
        },
      },
      fontFamily: {
        sans: [
          'GmarketSans',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
