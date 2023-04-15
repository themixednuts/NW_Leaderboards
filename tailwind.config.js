/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        'leaderboard': "url('/lyshineui/images/leaderboards/leaderboard_backdrop_overlay.png')",
      }
    },
  },
  plugins: [require('daisyui')],
}

