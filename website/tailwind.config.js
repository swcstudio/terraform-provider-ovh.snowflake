/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
  });
}

function flattenColorPalette(colors) {
  return Object.assign(
    {},
    ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
      typeof values == 'object'
        ? Object.entries(flattenColorPalette(values)).map(([number, hex]) => ({
            [color + (number === 'DEFAULT' ? '' : `-${number}`)]: hex,
          }))
        : [{ [`${color}`]: values }]
    )
  );
}

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    './docs/**/*.{js,jsx,ts,tsx,md,mdx}',
    './api/**/*.{js,jsx,ts,tsx,md,mdx}',
    './community/**/*.{js,jsx,ts,tsx,md,mdx}',
    './static/**/*.{js,jsx,ts,tsx}',
    './docusaurus.config.{js,ts}',
    './sidebars.{js,ts}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // OVH Brand Colors
        ovh: {
          50: '#f0f4ff',
          100: '#e6edff',
          200: '#d1dcff',
          300: '#a3bdff',
          400: '#7a9cff',
          500: '#4a5fff', // Primary OVH Blue
          600: '#3b4dcc',
          700: '#2d3999',
          800: '#1f2666',
          900: '#141833',
          950: '#0a0c1a',
        },
        // Snowflake Brand Colors
        snowflake: {
          50: '#f0fcff',
          100: '#e6faff',
          200: '#ccf5ff',
          300: '#99ebff',
          400: '#65ccf1',
          500: '#29b5e8', // Primary Snowflake Blue
          600: '#1aa3d1',
          700: '#1480a2',
          800: '#0f5c73',
          900: '#0a3d4d',
          950: '#051f26',
        },
        // Spectrum Web Co Brand Colors
        spectrum: {
          purple: {
            50: '#f7f5ff',
            100: '#f0ebff',
            200: '#e2d9ff',
            300: '#c9b8ff',
            400: '#a8a4ff',
            500: '#6c5ce7', // Primary Purple
            600: '#5a4bc4',
            700: '#483aa1',
            800: '#36297e',
            900: '#24185b',
            950: '#120c2e',
          },
          blue: {
            50: '#f0f9ff',
            100: '#e6f4ff',
            200: '#ccebff',
            300: '#99d9ff',
            400: '#74b9ff', // Accent Blue
            500: '#4a9eff',
            600: '#2080f7',
            700: '#1e6ad8',
            800: '#1a54b3',
            900: '#16408e',
            950: '#0b1f47',
          },
        },
        // Enhanced system colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sans: ['Mona Sans', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'fade-in-left': 'fade-in-left 0.5s ease-out',
        'fade-in-right': 'fade-in-right 0.5s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(74, 95, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(74, 95, 255, 0.8)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'spectrum-gradient': 'linear-gradient(135deg, #29b5e8 0%, #4a5fff 50%, #6c5ce7 100%)',
        'ovh-gradient': 'linear-gradient(135deg, #4a5fff 0%, #6c5ce7 100%)',
        'snowflake-gradient': 'linear-gradient(135deg, #29b5e8 0%, #47c1ed 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: '500',
            },
            'a:hover': {
              color: '#4a5fff',
            },
            strong: {
              color: 'inherit',
              fontWeight: '600',
            },
            'ol > li::marker': {
              fontWeight: '600',
              color: '#4a5fff',
            },
            'ul > li::marker': {
              color: '#4a5fff',
            },
            hr: {
              borderColor: '#374151',
              marginTop: '3em',
              marginBottom: '3em',
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: 'inherit',
              borderLeftWidth: '0.25rem',
              borderLeftColor: '#4a5fff',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
            },
            h1: {
              color: 'inherit',
              fontWeight: '800',
            },
            h2: {
              color: 'inherit',
              fontWeight: '700',
            },
            h3: {
              color: 'inherit',
              fontWeight: '600',
            },
            h4: {
              color: 'inherit',
              fontWeight: '600',
            },
            'figure figcaption': {
              color: '#9ca3af',
            },
            code: {
              color: 'inherit',
              fontWeight: '500',
            },
            'a code': {
              color: 'inherit',
            },
            pre: {
              color: 'inherit',
              backgroundColor: '#1f2937',
            },
            thead: {
              color: 'inherit',
              fontWeight: '600',
              borderBottomWidth: '1px',
              borderBottomColor: '#374151',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: '#374151',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    addVariablesForColors,
    // Custom plugin for Docusaurus integration
    function({ addUtilities, addComponents, theme }) {
      addUtilities({
        '.text-gradient': {
          background: 'linear-gradient(135deg, #29b5e8 0%, #4a5fff 50%, #6c5ce7 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.animate-fade-in': {
          animation: 'fade-in 0.5s ease-out',
        },
        '.animate-fade-in-up': {
          animation: 'fade-in-up 0.5s ease-out',
        },
        '.animate-scale-in': {
          animation: 'scale-in 0.5s ease-out',
        },
        '.backdrop-blur-safari': {
          '-webkit-backdrop-filter': 'blur(var(--tw-backdrop-blur))',
        },
      });

      addComponents({
        '.btn': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s',
        },
        '.btn-primary': {
          backgroundColor: theme('colors.ovh.500'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.ovh.600'),
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.snowflake.500'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.snowflake.600'),
          },
        },
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.md'),
          border: `1px solid ${theme('colors.gray.200')}`,
        },
        '.card-dark': {
          backgroundColor: theme('colors.gray.800'),
          borderColor: theme('colors.gray.700'),
          color: theme('colors.gray.100'),
        },
      });
    },
  ],
  corePlugins: {
    // Disable some core plugins that might conflict with Docusaurus
    preflight: false,
  },
};