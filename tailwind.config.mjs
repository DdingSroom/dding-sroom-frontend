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
        /** color token */
        primary: {
          700: '#0C1B71',
          600: '#2238B3',
          500: '#4A66FF',
          400: '#788DFF',
          300: '#8799FF',
          200: '#B1BDFF',
          100: '#DDE2FF',
        },
        gray: {
          700: '#252525',
          600: '#333333',
          500: '#4E4E4E',
          400: '#6E6E6E',
          300: '#9999A3',
          200: '#D6D6D6',
          100: '#EBECEF',
          50: '#F9FAFB',
        },
        red: {
          500: '#d32929',
          400: '#ff6d6d',
          300: '#ffa2a2',
          200: '#ffcdcd',
          100: '#ffe3e3',
        },
        white: '#FFFFFF',
        black: '#000000',

        // (사용하지 않음. 아래 컬러 사용 지양.. 위의 컬러 토큰 활용하기)
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
        /* brand */
        brand: {
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

      /** typhography token */
      fontSize: {
        // header
        'display-01': ['2.625rem', { lineHeight: '1.2', fontWeight: '600' }], // 42px
        'display-02': ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }], // 36px
        'display-03': ['2rem', { lineHeight: '1.2', fontWeight: '600' }], // 32px
        'display-04': ['1.75rem', { lineHeight: '1.2', fontWeight: '600' }], // 28px

        // sub-header
        'title-01': ['1.25rem', { lineHeight: '1.2', fontWeight: '500' }], // 20px
        'title-02': ['1.125rem', { lineHeight: '1.2', fontWeight: '500' }], // 18px

        // body
        'body-01': ['1rem', { lineHeight: '1.2', fontWeight: '400' }], // 16px
        'body-02': ['0.875rem', { lineHeight: '1.2', fontWeight: '400' }], // 14px

        // caption
        caption: ['0.75rem', { lineHeight: '1.2', fontWeight: '400' }], // 12px

        // (사용하지 않을 예정)
        '2xs': '10px',
        'xs-plus': '11px',
        'sm-minus': '13px',
        md: '15px',
        'lg-minus': '17px',
        'heading-sm': '22px',
        'heading-md': '25px',
        'heading-lg': '28px',
        'heading-xl': '32px',
      },
      zIndex: {
        dropdown: '10',
        header: '100',
        modal: '9999',
      },
      lineHeight: {
        info: '1.9',
        'info-relaxed': '1.95',
      },
      width: {
        modal: '90%',
        'btn-action': '100px',
        'time-slot': '8px',
      },
      maxWidth: {
        modal: '500px',
        'modal-sm': '400px',
        layout: '600px',
        content: '95%',
        thumb: '160px',
      },
      minWidth: {
        grid: '720px',
      },
      height: {
        'time-slot': '14px',
        'tab-indicator': '3px',
      },
      maxHeight: {
        modal: '70vh',
        'modal-lg': '90vh',
        'modal-body': 'calc(90vh - 80px)',
      },
      minHeight: {
        banner: '240px',
        'banner-card': '280px',
      },
      inset: {
        'tab-indicator': '-1px',
      },
      scale: {
        press: '0.99',
      },
    },
  },
  plugins: [],
};
