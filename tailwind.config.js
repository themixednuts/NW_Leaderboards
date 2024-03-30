import { fontFamily } from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
const config = {
  plugins: [require('tailwindcss-contain'), require('tailwind-merge'), require('tailwind-variants'), require('@designbycode/tailwindcss-mask-image')],
  darkMode: ['class'],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: ['dark'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        tan: {
          warm: 'hsl(var(--tan-warm) / <alpha-value>)',
          med: 'hsl(var(--tan-med) / <alpha-value>)',
        },
        blue: {
          bright: 'hsl(var(--blue-bright) / <alpha-value>)',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        faction: {
          purple: 'var(--faction-purple)',
          foreground: {
            0: {
              DEFAULT: 'rgba(255, 255, 255, 1)',
            },
            1: {
              DEFAULT: 'rgba(255, 255, 255, 1)',
            },
            2: {
              DEFAULT: 'rgba(255, 255, 255, 1)',
            },
            3: {
              DEFAULT: 'rgba(255, 255, 255, 1)',
            },
          },
          background: {
            0: {
              DEFAULT: 'rgba(255, 255, 255, 1)',
              dark: 'rgba(255, 255, 255, 1)',
              light: 'rgba(255, 255, 255, 1)',
            },
            1: {
              DEFAULT: 'var(--faction-purple)',
              dark: 'var(--faction-purple-dark)',
              light: 'var(--faction-purple-light)',
            },
            2: {
              DEFAULT: 'var(--faction-green)',
              dark: 'var(--faction-green-dark)',
              light: 'var(--faction-green-light)',
            },
            3: {
              DEFAULT: 'var(--amazon-orange)',
              dark: 'var(--amazon-orange-dark)',
              light: 'var(--amazon-orange-light)',
            },
          },
          chat: {
            0: 'rgba(153, 153, 153, 1)',
            1: 'var(--faction-purple-chat)',
            2: 'var(--faction-green-chat)',
            3: 'var(--amazon-orange)',
          },
          logo: {
            1: 'rgba(82, 62, 87, 1)',
            2: 'rgba(31, 113, 39, 1)',
            3: 'rgba(164, 55, 19, 1)',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: [...fontFamily.sans],
      },
    },
  },
}

export default config
