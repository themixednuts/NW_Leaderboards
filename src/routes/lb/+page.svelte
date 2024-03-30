<script lang="ts">
  import { assets, resolveRoute } from '$app/paths'
  import { FirstLevelCategory, type LeaderboardData } from '$lib/leaderboard/types'
  import {
    sort_leaderboards,
    match_leaderboard,
    normalize_leaderboard_string,
    FACTION_IMAGE_PATHS,
  } from '$lib/leaderboard/utils'
  import { onMount } from 'svelte'

  let { data } = $props()
  let seasons: Awaited<(typeof data)['lbs']>['seasons'] = $state([])

  let currentIndex = $state(0)
  let bannerMap = $derived({
    [FirstLevelCategory.MutatedExpeditions]: '/lyshineui/images/leaderboards/leaderboard_cat_bg_expeditions.png',
    [FirstLevelCategory.FactionWar]: FACTION_IMAGE_PATHS[currentIndex],
    [FirstLevelCategory.VsEnvironment]: '/lyshineui/images/leaderboards/leaderboard_cat_bg_environment.png',
    [FirstLevelCategory.VsPlayers]: '/lyshineui/images/leaderboards/leaderboard_cat_bg_player.png',
    [FirstLevelCategory.TradeSkills]: '/lyshineui/images/leaderboards/leaderboard_cat_bg_trade.png',
  } as const)

  let bannerKeys = $derived(Object.keys(bannerMap) as (keyof typeof bannerMap)[])
  $inspect(bannerKeys)

  $effect(() => {
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % FACTION_IMAGE_PATHS.length
    }, 15000)

    return () => {
      clearInterval(interval)
    }
  })

  let leaderboards: LeaderboardData[] | undefined = $state()
  $inspect(leaderboards)

  onMount(async () => {
    const lbs = await data.lbs
    leaderboards = lbs.leaderboards.sort(sort_leaderboards)
    seasons = lbs.seasons
  })
</script>

<div
  class="grid-col-1 grid grow grid-flow-row gap-2 place-self-center border-2 md:grid-cols-[1fr,1.31967213fr,1fr] md:grid-rows-3"
>
  {#each bannerKeys as banner, key}
    {@const leaderboard = leaderboards?.find((leaderboard) =>
      match_leaderboard(leaderboard, { FirstLevelCategory: banner }),
    )}
    {#if leaderboard && seasons}
      {@const type = match_leaderboard(leaderboard, { FactionLeaderboard: true }) ? 'faction' : 'character'}
      <a
        href={resolveRoute('/lb/[first]/[category]/[second]/[rotation]/[type]/[season]', {
          type,
          rotation: normalize_leaderboard_string(leaderboard, 'Rotation'),
          first: normalize_leaderboard_string(leaderboard, 'FirstLevelCategory'),
          category: normalize_leaderboard_string(leaderboard, 'Category'),
          second: normalize_leaderboard_string(leaderboard, 'SecondLevelCategory'),
          season: seasons[seasons.length - 1],
        })}
        class="relative col-span-1 row-span-1 grid h-full max-h-min overflow-clip border-[1px] border-stone-400 border-opacity-80 bg-center object-cover hover:cursor-pointer hover:border-accent"
        class:sm:row-span-full={key === 0 || key === 1}
        class:sm:col-span-2={key === 4}
        class:md:col-span-1={key === 4}
      >
        <img loading="lazy" src={`${assets}${bannerMap[banner]}`} class="w-full" alt="" title={banner} />

        <div

          class="absolute left-1/2 top-1/2 h-[calc(100%-10px)] w-[calc(100%-10px)] -translate-x-1/2 -translate-y-1/2 overflow-clip border-[1px] border-stone-400 border-opacity-60"
        >
          <div
            class="absolute left-0 top-0 z-10 grid h-full w-full bg-opacity-25 text-2xl hover:bg-opacity-0 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
          >
            <div class="self-end px-4 py-4 text-white">
              {banner}
            </div>
          </div>
        </div>
      </a>
    {/if}
  {/each}
</div>
