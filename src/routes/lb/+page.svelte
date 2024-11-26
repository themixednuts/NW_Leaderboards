<script lang="ts">
  import { resolveRoute } from '$app/paths'
  import { FirstLevelCategory } from '$lib/leaderboard/types'
  import { match_leaderboard, normalize_leaderboard_string, BANNER_MAP } from '$lib/leaderboard/utils'
  import type { PageData } from './$types.js'
  import { cn } from '@/shadcn/utils.js'
  import Banner from '@/leaderboard/banner.svelte'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
  let seasons = $derived(data.seasons)
  let leaderboards = $derived(data.leaderboards)
  const bannerkeys = Object.keys(BANNER_MAP) as (keyof BANNER_MAP)[]

  let base =
    'relative col-span-1 row-span-1 grid h-full max-h-min overflow-clip border-[1px] border-stone-400 border-opacity-80 bg-center object-cover hover:border-accent'
</script>

<div
  class="grid-col-1 grid h-full grow grid-flow-row gap-2 place-self-center md:grid-cols-[1fr,1.31967213fr,1fr] md:grid-rows-3"
>
  {#each bannerkeys as banner, _}
    {@const leaderboard = leaderboards?.find((leaderboard) =>
      match_leaderboard(leaderboard, { FirstLevelCategory: banner }),
    )}
    {#if leaderboard && seasons}
      {@const type = match_leaderboard(leaderboard, { FactionLeaderboard: true }) ? 'faction' : 'character'}
      <Banner
        href={resolveRoute('/lb/[first]/[category]/[second]/[rotation]/[type]/[season]/1', {
          type,
          rotation: normalize_leaderboard_string(leaderboard, 'Rotation'),
          first: normalize_leaderboard_string(leaderboard, 'FirstLevelCategory'),
          category: normalize_leaderboard_string(leaderboard, 'Category'),
          second: normalize_leaderboard_string(leaderboard, 'SecondLevelCategory'),
          season: seasons[seasons.length - 1],
        })}
        label={banner}
        class={cn(base, {
          'sm:row-span-full':
            banner === FirstLevelCategory.MutatedExpeditions || banner === FirstLevelCategory.FactionWar,
          'sm:col-span-1 sm:row-start-2': banner === FirstLevelCategory.VsPlayers,
          'sm:row-start-3': banner === FirstLevelCategory.TradeSkills,
        })}
      />
    {:else}
      <Banner
        label={banner}
        class={cn(base, {
          'sm:row-span-full':
            banner === FirstLevelCategory.MutatedExpeditions || banner === FirstLevelCategory.FactionWar,
          'sm:col-span-1 sm:row-start-2': banner === FirstLevelCategory.VsPlayers,
          'sm:row-start-3': banner === FirstLevelCategory.TradeSkills,
        })}
      />
    {/if}
  {/each}
</div>
