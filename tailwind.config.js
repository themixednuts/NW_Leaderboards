/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        leaderboard:
          "url('/lyshineui/images/leaderboards/leaderboard_backdrop_overlay.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-radial-to-tr':
          'radial-gradient(115% 90% at 0% 100%, var(--tw-gradient-stops))',
        'gradient-radial-to-tl':
          'radial-gradient(115% 90% at 100% 100%, var(--tw-gradient-stops))',
        'gradient-radial-to-br':
          'radial-gradient(90% 115% at 0% 0%, var(--tw-gradient-stops))',
        'gradient-radial-to-bl':
          'radial-gradient(90% 115% at 100% 0%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('daisyui')],
}
