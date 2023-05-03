<script lang="ts">
  import { assets } from '$app/paths'
  import { createEventDispatcher } from 'svelte'

  export let categories

  const dispatch = createEventDispatcher()
  type BannerMap = {
    [key: string]: string
  }

  const bannerMap: BannerMap & {
    'Mutated Expeditions': '/lyshineui/images/leaderboards/leaderboard_cat_bg_expeditions.png'
    'Faction War': '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_convenant.png'
    'Vs. Environment': '/lyshineui/images/leaderboards/leaderboard_cat_bg_environment.png'
    'Vs. Players': '/lyshineui/images/leaderboards/leaderboard_cat_bg_player.png'
    'Trade Skills': '/lyshineui/images/leaderboards/leaderboard_cat_bg_trade.png'
  } = {
    'Mutated Expeditions':
      '/lyshineui/images/leaderboards/leaderboard_cat_bg_expeditions.png',
    'Faction War':
      '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_convenant.png',
    'Vs. Environment':
      '/lyshineui/images/leaderboards/leaderboard_cat_bg_environment.png',
    'Vs. Players':
      '/lyshineui/images/leaderboards/leaderboard_cat_bg_player.png',
    'Trade Skills':
      '/lyshineui/images/leaderboards/leaderboard_cat_bg_trade.png',
  } as const
</script>

<div
  class=" relative col-span-full row-span-1 flex max-h-full w-full place-content-center border-2 border-base-100 lg:col-start-2 lg:col-end-5 lg:place-self-start {$categories.firstlevelcategory
    ? 'lg:flex'
    : 'lg:hidden'}  rounded-box p-2"
>
  <div
    class="rounded-box relative max-h-fit overflow-clip border-2 border-base-100 bg-black"
  >
    <a href="/lb" data-sveltekit-reload>
      <img
        src={`${assets}${
          bannerMap[$categories.firstlevelcategory || 'Mutated Expeditions']
        }`}
        alt=""
        class="max-h-full w-full object-cover object-top"
      />
      <div
        class="absolute left-0 top-0 z-10 hidden h-full w-full cursor-pointer select-none place-items-center bg-base-100 bg-opacity-0 text-4xl hover:bg-opacity-60 lg:grid"
      >
        <div class="absolute bottom-4 left-4 text-white">
          {$categories.firstlevelcategory}
        </div>
      </div>
    </a>
  </div>
</div>
<div
  class=" col-span-full row-span-full hidden h-full max-h-[29rem] grid-cols-3 grid-rows-3 place-items-center gap-2 {!$categories.firstlevelcategory
    ? 'lg:grid'
    : 'lg:hidden'} rounded-box w-full place-content-center border-2 border-base-100 p-2"
>
  {#each Object.keys(bannerMap) as banner, key}
    <button
      class="rounded-box relative grid h-full place-content-center overflow-clip border-2 border-base-100 bg-black hover:cursor-pointer hover:border-accent hover:bg-opacity-90 {key ===
      0
        ? 'col-span-1 row-span-full'
        : key === 1
        ? 'col-span-1 row-span-full place-self-center'
        : 'col-span-1 row-span-1'}"
      on:pointerup={(e) => {
        if (e.button !== 0) {
          return
        }
        dispatch('selectCategory', 'firstlevelcategory')
        $categories.firstlevelcategory = banner
      }}
    >
      <img
        src={`${assets}${bannerMap[banner]}`}
        alt=""
        title={banner}
        class="h-full w-full"
      />
      <div
        class="absolute left-0 top-0 z-10 grid h-full w-full place-items-center bg-base-100 bg-opacity-0 text-4xl hover:bg-opacity-60"
      >
        <div class="absolute bottom-4 left-4 text-white">
          {banner}
        </div>
      </div>
    </button>
  {/each}
</div>
