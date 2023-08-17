<script lang="ts">
  import { assets } from '$app/paths'
  import { createEventDispatcher, onMount } from 'svelte'

  export let categories

  const dispatch = createEventDispatcher()
  const factionImagePaths = [
    '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_syndicate.png',
    '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_maruaders.png',
    '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_convenant.png',
  ] as const

  let currentIndex = 0
  let currentImage = factionImagePaths[currentIndex]

  $: bannerMap = {
    'Mutated Expeditions':
      '/lyshineui/images/leaderboards/leaderboard_cat_bg_expeditions.png',
    'Faction War': currentImage,
    'Vs. Environment':
      '/lyshineui/images/leaderboards/leaderboard_cat_bg_environment.png',
    'Vs. Players':
      '/lyshineui/images/leaderboards/leaderboard_cat_bg_player.png',
    'Trade Skills':
      '/lyshineui/images/leaderboards/leaderboard_cat_bg_trade.png',
  } as const

  onMount(() => {
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % factionImagePaths.length
      currentImage = factionImagePaths[currentIndex]
    }, 10000)

    return () => {
      clearInterval(interval)
    }
  })
</script>

<div
  class=" relative col-span-full row-span-1 flex max-h-full w-full place-content-center border-2 border-base-100 lg:col-start-2 lg:col-end-5 lg:place-self-start {$categories.firstlevelcategory
    ? 'lg:flex'
    : 'lg:hidden'}  rounded-box p-2">
  <div
    class="rounded-box relative max-h-fit overflow-clip border-2 border-base-100 bg-black">
    <a href="/lb" data-sveltekit-reload>
      <img
        src={`${assets}${
          bannerMap[$categories.firstlevelcategory || 'Mutated Expeditions']
        }`}
        alt=""
        class="max-h-full w-full object-cover object-top" />
      <div
        class="absolute left-0 top-0 z-10 hidden h-full w-full cursor-pointer select-none place-items-center bg-base-100 bg-opacity-0 text-4xl hover:bg-opacity-60 lg:grid">
        <div class="absolute bottom-4 left-4 text-white">
          {$categories.firstlevelcategory}
        </div>
      </div>
    </a>
  </div>
</div>
<div
  class=" my-grid col-span-full row-span-full hidden max-h-min min-h-0 grid-rows-3 place-items-center gap-2 {!$categories.firstlevelcategory
    ? 'lg:grid'
    : 'lg:hidden'} rounded-box w-full place-content-center border-2 border-base-100 p-2">
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
      }}>
      <img src={`${assets}${bannerMap[banner]}`} alt="" title={banner} />
      <div
        class="absolute left-0 top-0 z-10 grid h-full w-full place-items-center bg-base-100 bg-opacity-0 text-left text-4xl hover:bg-opacity-60">
        <div class="absolute bottom-4 left-4 text-white">
          {banner}
        </div>
      </div>
    </button>
  {/each}
</div>

<style>
  .my-grid {
    --ratio: calc(644 / 488);
    grid-template-columns: 1fr 1.31967213fr 1fr;
  }
</style>
