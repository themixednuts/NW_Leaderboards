<script lang="ts">
  import { resolveRoute } from '$app/paths'
  import { FirstLevelCategory } from '$lib/leaderboard/types'
  import { match_leaderboard, normalize_leaderboard_string, FACTION_IMAGE_PATHS } from '$lib/leaderboard/utils'
  import type { PageData } from './$types.js'
  import { cn } from '@/shadcn/utils.js'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
  let seasons = $derived(data.seasons)
  let leaderboards = $derived(data.leaderboards)

  let index = $state(0)
  let banners = $derived([
    {
      label: FirstLevelCategory.MutatedExpeditions,
      src: '/lyshineui/images/leaderboards/leaderboard_cat_bg_expeditions.png',
    },
    {
      label: FirstLevelCategory.FactionWar,
      src: FACTION_IMAGE_PATHS[index],
    },
    {
      label: FirstLevelCategory.VsEnvironment,
      src: '/lyshineui/images/leaderboards/leaderboard_cat_bg_environment.png',
    },
    {
      label: FirstLevelCategory.VsPlayers,
      src: '/lyshineui/images/leaderboards/leaderboard_cat_bg_player.png',
    },
    {
      label: FirstLevelCategory.TradeSkills,
      src: '/lyshineui/images/leaderboards/leaderboard_cat_bg_trade.png',
    },
  ])

  let base =
    'relative col-span-1 row-span-1 grid h-full max-h-min overflow-clip border-[1px] border-stone-400 border-opacity-80 bg-center object-cover hover:border-accent'

  $effect(() => {
    const interval = setInterval(() => {
      index = (index + 1) % FACTION_IMAGE_PATHS.length
    }, 15000)

    return () => {
      clearInterval(interval)
    }
  })
</script>

<div
  class="grid-col-1 grid grow grid-flow-row gap-2 place-self-center border-2 md:grid-cols-[1fr,1.31967213fr,1fr] md:grid-rows-3"
>
  {#each banners as banner}
    {@const leaderboard = leaderboards?.find((leaderboard) =>
      match_leaderboard(leaderboard, { FirstLevelCategory: banner.label }),
    )}
    {@const label = banner.label}
    {@const src = banner.src}
    {#if leaderboard && seasons}
      {@const type = match_leaderboard(leaderboard, { FactionLeaderboard: true }) ? 'faction' : 'character'}
      <a
        href={resolveRoute('/lb/[first]/[category]/[second]/[rotation]/[type]/[season]/1', {
          type,
          rotation: normalize_leaderboard_string(leaderboard, 'Rotation'),
          first: normalize_leaderboard_string(leaderboard, 'FirstLevelCategory'),
          category: normalize_leaderboard_string(leaderboard, 'Category'),
          second: normalize_leaderboard_string(leaderboard, 'SecondLevelCategory'),
          season: seasons[seasons.length - 1],
        })}
        class={cn(base, {
          'sm:row-span-full':
            label === FirstLevelCategory.MutatedExpeditions || label === FirstLevelCategory.FactionWar,
          'sm:col-span-1 sm:row-start-2': label === FirstLevelCategory.VsPlayers,
          'sm:row-start-3': label === FirstLevelCategory.TradeSkills,
        })}
      >
        {@render bannerss(label, src)}
      </a>
    {:else}
      <div
        class={cn(base, {
          'sm:row-span-full':
            label === FirstLevelCategory.MutatedExpeditions || label === FirstLevelCategory.FactionWar,
          'sm:col-span-1 sm:row-start-2': label === FirstLevelCategory.VsPlayers,
          'sm:row-start-3': label === FirstLevelCategory.TradeSkills,
        })}
      >
        {@render bannerss(label, src)}
      </div>
    {/if}
  {/each}
</div>

{#snippet bannerss(label, src)}
  <img loading="lazy" {src} class="w-full" alt="" title={label} />

  <div
    class="absolute left-1/2 top-1/2 h-[calc(100%-10px)] w-[calc(100%-10px)] -translate-x-1/2 -translate-y-1/2 overflow-clip border-[1px] border-stone-400 border-opacity-60"
  >
    <div
      class="absolute left-0 top-0 z-10 grid h-full w-full bg-opacity-25 text-2xl hover:bg-opacity-0 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
    >
      <div class="self-end px-4 py-4 text-white">
        {label}
      </div>
    </div>
  </div>
{/snippet}
