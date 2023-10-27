/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        leaderboard: "url('/lyshineui/images/leaderboards/leaderboard_backdrop_overlay.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-radial-to-tr': 'radial-gradient(115% 90% at 0% 100%, var(--tw-gradient-stops))',
        'gradient-radial-to-tl': 'radial-gradient(115% 90% at 100% 100%, var(--tw-gradient-stops))',
        'gradient-radial-to-br': 'radial-gradient(90% 115% at 0% 0%, var(--tw-gradient-stops))',
        'gradient-radial-to-bl': 'radial-gradient(90% 115% at 100% 0%, var(--tw-gradient-stops))',
        'item-rarity-square-0':
          "url('/lyshineui/images/slices/itemlayout/itemraritybgsquare0.png'), url('/lyshineui/images/slices/itemlayout/itembgsquare0.png')",
        'item-rarity-square-1':
          "url('/lyshineui/images/slices/itemlayout/itemraritybgsquare1.png'), url('/lyshineui/images/slices/itemlayout/itembgsquare1.png')",
        'item-rarity-square-2':
          "url('/lyshineui/images/slices/itemlayout/itemraritybgsquare2.png'), url('/lyshineui/images/slices/itemlayout/itembgsquare2.png')",
        'item-rarity-square-3':
          "url('/lyshineui/images/slices/itemlayout/itemraritybgsquare3.png'), url('/lyshineui/images/slices/itemlayout/itembgsquare3.png')",
        'item-rarity-square-4':
          "url('/lyshineui/images/slices/itemlayout/itemraritybgsquare4.png'), url('/lyshineui/images/slices/itemlayout/itembgsquare4.png')",
        'item-rarity-square-artifact':
          "url('/lyshineui/images/slices/itemlayout/itemraritybgsquareartifact.png'), url('/lyshineui/images/slices/itemlayout/itembgsquareartifact.png')",
        'item-rarity-circle-0':
          "url('/lyshineui/images/slices/itemlayout/itemraritybgcircle0.png'), url('/lyshineui/images/slices/itemlayout/itembgcircle0.png')",
        'item-rarity-circle-1':
          "url('/lyshineui/images/slices/itemlayout/itemraritybgcircle1.png'), url('/lyshineui/images/slices/itemlayout/itembgcircle1.png')",
        'item-rarity-circle-2':
          "url('/lyshineui/images/slices/itemlayout/itemraritybgcircle2.png'), url('/lyshineui/images/slices/itemlayout/itembgcircle2.png')",
        'item-rarity-circle-3':
          "url('/lyshineui/images/slices/itemlayout/itemraritybgcircle3.png'), url('/lyshineui/images/slices/itemlayout/itembgcircle3.png')",
        'item-rarity-circle-4':
          "url('/lyshineui/images/slices/itemlayout/itemraritybgcircle4.png'), url('/lyshineui/images/slices/itemlayout/itembgcircle4.png')",
        'contract-category':
          "url('/lyshineui/images/contracts/contracts_categorybuttonselected.png'), url('/lyshineui/images/contracts/contracts_categorybuttonhash.png')",
        'contract-subcategory':
          "url('/lyshineui/images/contracts/contracts_subcategorybutton_glow.png'), url('/lyshineui/images/contracts/contracts_subcategorybutton_hash.png')",
        'contract-browser': "url('/lyshineui/images/tradingpost/tradingpostbg.png')",
        'search': "url('/lyshineui/images/slices/textinputsearch/primarysearchbg.png')",
        'search-hover': "url('/lyshineui/images/slices/textinputsearch/primarysearchbgfocus.png')",
        'contract-item': "url('/lyshineui/images/tradingpost/tradeentryhighlight.png')",
        'contract-tab': "url('/lyshineui/images/tradingpost/tabbg.png')",
        'contract-sort-l': "url('/lyshineui/images/tradingpost/sortbuttonbgleft.png')",
        'contract-sort-m': "url('/lyshineui/images/tradingpost/sortbuttonbgmid.png')",
        'contract-sort-r': "url('/lyshineui/images/tradingpost/sortbuttonbgright.png')",
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
  },
  safelist: [
    { pattern: /^bg-item-rarity-/ },
    "rotate-180"
  ]
}
