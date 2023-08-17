<script lang="ts">
  import { assets } from '$app/paths'
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { leaderboardMap } from '$lib/leaderboardmap'

  export let data: PageData

  data

  const factionImagePaths = [
    '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_syndicate.png',
    '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_maruaders.png',
    '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_convenant.png',
  ] as const

  let currentIndex = 0
  $: bannerMap = {
    'Mutated Expeditions':
      '/lyshineui/images/leaderboards/leaderboard_cat_bg_expeditions.png',
    'Faction War': factionImagePaths[currentIndex],
    'Vs. Environment':
      '/lyshineui/images/leaderboards/leaderboard_cat_bg_environment.png',
    'Vs. Players':
      '/lyshineui/images/leaderboards/leaderboard_cat_bg_player.png',
    'Trade Skills':
      '/lyshineui/images/leaderboards/leaderboard_cat_bg_trade.png',
  } as const

  $: bannerKeys = Object.keys(bannerMap) as (keyof typeof bannerMap)[]

  onMount(() => {
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % factionImagePaths.length
    }, 15000)

    return () => {
      clearInterval(interval)
    }
  })
</script>

<div
  class="col-span-full row-span-1 grid h-fit w-full grid-cols-[1fr,1.31967213fr,1fr] grid-rows-3 gap-2 place-self-center border-2 border-base-100">
  {#each bannerKeys as banner, key}
    <a
      href="{$page.url.href}/{leaderboardMap[banner][
        Object.keys(leaderboardMap[banner])[0]
      ][
        Object.keys(
          leaderboardMap[banner][Object.keys(leaderboardMap[banner])[0]],
        )[0]
      ][0].LeaderboardDefinitionId}/{data.currentSeason}"
      class="relative grid h-full max-h-min place-content-center overflow-clip border-[1px] border-stone-400 border-opacity-80 bg-base-100 bg-center hover:cursor-pointer hover:border-accent {key ===
      0
        ? 'col-span-1 row-span-full'
        : key === 1
        ? 'col-span-1 row-span-full place-self-center'
        : 'col-span-1 row-span-1'}">
      <img src={`${assets}${bannerMap[banner]}`} alt="" title={banner} />

      <div
        class=" absolute left-1/2 top-1/2 h-[calc(100%-10px)] w-[calc(100%-10px)] -translate-x-1/2 -translate-y-1/2 overflow-clip border-[1px] border-stone-400 border-opacity-60">
        <div
          class="absolute left-0 top-0 z-10 grid h-full w-full bg-base-100 bg-opacity-25 text-2xl hover:bg-opacity-0 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          <div class="self-end px-4 py-4 text-white">
            {banner}
          </div>
        </div>
      </div>
    </a>
  {/each}
</div>
