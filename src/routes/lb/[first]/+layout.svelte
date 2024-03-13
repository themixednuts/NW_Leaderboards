<script lang="ts">
  import { page } from '$app/stores'
  import {
    find_leaderboard_by_filter,
    find_leaderboard_by_id_secondcategory,
    find_leaderboard_by_id_secondcategory_filter,
    find_leaderboard_by_secondcategory,
    find_leaderboard_by_secondcategory_filter,
    type LeaderboardData,
  } from '$lib/leaderboard/leaderboard.js'
  import {
    bannerMap,
    currentImageBanner,
    factionImagePaths,
    getBannerMapKey,
    seasons as getSeasons,
  } from '$lib/leaderboard/utils'
  import { onMount } from 'svelte'
  import { assets, resolveRoute } from '$app/paths'

  let { data } = $props()
  let leaderboards: LeaderboardData[] | undefined = $state()
  let seasonDetails: HTMLDetailsElement | undefined = $state()
  let leaderboardDetails: HTMLDetailsElement | undefined = $state()
  let filter = $derived($page.params.filter?.toLowerCase())
  let first = $derived($page.params.first?.toLowerCase())
  let labels = $derived.by(() => {
    const red = leaderboards?.reduce(
      (acc, leaderboard) => {
        if (!acc[leaderboard.Category]) acc[leaderboard.Category] = new Set()
        acc[leaderboard.Category].add(leaderboard.SecondLevelCategory)
        return acc
      },
      {} as { [k: string]: Set<string> },
    )
    if (red) return Object.entries(red)
  })
  let leaderboard = $derived(leaderboards?.find((leaderboard) => leaderboard.LeaderboardId))

  let currentIndex = 0

  let seasons = $derived(getSeasons(data.validSeasons))

  let bannerImgSrc = $derived.by(() => {
    for (const key of Object.keys(bannerMap) as (keyof typeof bannerMap)[]) {
      if (key.toLowerCase().replaceAll(' ', '').replaceAll('.', '') === $page.params.first.toLowerCase()) {
        return currentImageBanner(key, currentIndex)
      }
    }
  })

  $effect(() => {
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % factionImagePaths.length
    }, 15000)

    if ($page.params.first !== 'factionwar') clearInterval(interval)
    return () => clearInterval(interval)
  })

  onMount(async () => {
    leaderboards = await data.leaderboards
  })
</script>

<div class="my-grid overflow-y relative z-20 grid max-h-full min-w-fit gap-2 overflow-x-hidden bg-base-300 px-2 py-2">
  <div
    class="grid h-full w-full grid-cols-2 grid-rows-2 place-items-center gap-2 border-2 border-base-100 p-2 md:col-end-3 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2"
  >
    <div class="join col-span-full row-start-1 row-end-2 gap-1 place-self-center self-end rounded-none">
      <a
        class="btn join-item btn-xs text-center sm:btn-md hover:ring-1"
        class:btn-primary={filter === 'faction'}
        class:btn-disabled={!leaderboards?.find((leaderboard) => find_leaderboard_by_filter(leaderboard, 'faction'))}
      >
        Faction
      </a>
      <a
        class="btn join-item btn-xs text-center sm:btn-md hover:ring-1"
        class:btn-primary={filter === 'company'}
        class:btn-disabled={!leaderboards?.find((leaderboard) => find_leaderboard_by_filter(leaderboard, 'company'))}
      >
        Company
      </a>
      <a
        class="btn join-item btn-xs text-center sm:btn-md hover:ring-1"
        class:btn-primary={filter === 'character'}
        class:btn-disabled={!leaderboards?.find((leaderboard) => find_leaderboard_by_filter(leaderboard, 'character'))}
      >
        Character
      </a>
    </div>
    <div class="join col-span-full row-start-2 row-end-3 self-start rounded-none">
      <details class="dropdown" bind:this={seasonDetails}>
        <summary class="btn join-item m-1">
          {seasons.find((s) => $page.params.season === s.id)?.label || seasons[0].label}
        </summary>
        <ul class="menu dropdown-content z-[1] w-52 bg-base-100 p-2 shadow">
          {#each seasons as season}
            <li>
              <a
                href={resolveRoute('/lb/[first]/[filter]/[lbid]/[season]', {
                  first,
                  filter,
                  lbid: $page.params.lbid,
                  season: season.id,
                })}
                on:click={() => (seasonDetails!.open = false)}
                class="rounded-none"
              >
                {season.label}
              </a>
            </li>
          {/each}
        </ul>
      </details>
      {#if leaderboards}
        <details class="dropdown" bind:this={leaderboardDetails}>
          <!-- <summary class="btn join-item m-1">{leaderboard.DisplayName}</summary>
          <ul class="menu dropdown-content z-[1] w-52 bg-base-100 p-2 shadow">
            {#each leaderboards as leaderboard}
              {#if leaderboard[data.filter]}
                <li>
                  <a
                    href="/lb/{leaderboard.LeaderboardDefinitionId}/{data.currentSeason}"
                    on:click={() => (leaderboardDetails.open = false)}
                    class="rounded-none"
                  >
                    {leaderboard.DisplayName}
                  </a>
                </li>
              {/if}
            {/each}
          </ul> -->
        </details>
      {/if}
    </div>
  </div>
  <div
    class=" relative col-span-full row-span-1 flex h-full w-full place-content-center border-2 border-base-100 p-2 lg:col-start-2 lg:col-end-5 lg:place-self-start"
  >
    <div class="relative max-h-min min-w-full overflow-clip border-2 border-stone-400 border-opacity-80 bg-black">
      <a href="/lb" class="">
        <img src={`${assets}${bannerImgSrc}`} alt="" class="h-full w-full object-cover object-right-top" />
        <div
          class="absolute left-0 top-0 z-10 grid h-full w-full bg-base-100 bg-opacity-25 text-2xl hover:bg-opacity-0 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
        >
          <div class="self-end px-4 py-6 text-white">
            {getBannerMapKey(first) || 'Mutated Expeditions'}
          </div>
        </div>
        <div
          class="absolute left-1/2 top-1/2 h-[calc(100%-10px)] w-[calc(100%-10px)] -translate-x-1/2 -translate-y-1/2 border-[1px] border-stone-400 border-opacity-60"
        />
      </a>
    </div>
  </div>
  <div
    class="col-start-1 col-end-5 row-start-3 row-end-4 grid min-h-[5vh] w-full gap-2 overflow-auto border-2 border-base-100 bg-base-300 py-2 uppercase md:col-start-3 md:row-start-2 md:row-end-3 md:max-h-[15vh] lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-5 lg:h-full lg:max-h-full lg:gap-2"
  >
    {#if labels?.length && leaderboards}
      {#each labels as [key, set]}
        <div class="flex grow-0 flex-col gap-2 px-2">
          <div class="flex flex-nowrap border-b-2 border-base-100 bg-base-300 px-2 text-xl">
            {@html key.replace('/lyshineui/images', 'https://cdn.nwdb.info/db/images/live/v35')}
          </div>
          {#each set as subitem}
            {@const leaderboard = leaderboards.find((leaderboard) =>
              find_leaderboard_by_secondcategory_filter(leaderboard, subitem, filter),
            )}
            <a
              class="text-md btn relative rounded-none border-4 border-transparent p-0 text-left hover:link hover:animate-[pulse_1.5s_ease-in-out_infinite] hover:border-l-primary"
              class:border-l-primary={find_leaderboard_by_id_secondcategory(leaderboard, $page.params.lbid, subitem)}
              class:btn-disabled={!leaderboard}
              href={resolveRoute('/lb/[first]/[filter]/[lbid]/[season]', {
                first,
                filter,
                lbid: leaderboard?.LeaderboardId.toLowerCase() || $page.params.lbid || '',
                season: $page.params.season || data.validSeasons[data.validSeasons.length - 1],
              })}
            >
              {subitem}
            </a>
          {/each}
        </div>
      {/each}
    {/if}
  </div>
</div>
<!-- <div
  class="my-grid-row relative col-span-full row-span-2 row-start-4 grid h-full w-full grid-cols-1 place-self-start border-2 border-base-100 md:row-span-full md:row-start-3 lg:col-start-2 lg:col-end-5 lg:row-start-2 lg:row-end-5"
> -->
<slot />

<!-- </div> -->

<style>
  .my-grid {
    grid-template-rows:
      minmax(15vh, 0.5fr) min-content minmax(15vh, min-content)
      minmax(35vh, 1fr);
    grid-template-columns: repeat(2, minmax(min-content, auto)) repeat(2, minmax(min-content, 1fr));
  }
</style>
