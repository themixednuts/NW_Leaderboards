<script lang="ts">
  import Table from '$lib/leaderboard/table.svelte'
  import type { PageData } from './$types'
  import { page } from '$app/stores'
  import { LEADERBOARD_ID_MAP, LEADERBOARD_DATA, type LeaderboardDefinition } from '$lib/leaderboard/leaderboardmap'
  import { assets } from '$app/paths'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'

  export let data: PageData

  $: id = data.id as keyof typeof LEADERBOARD_ID_MAP
  $: leaderboardId = $page.params.lbid || ''

  $: filter = $page.url.searchParams.get('filter') ?? data.filter

  const factionImagePaths = [
    '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_syndicate.png',
    '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_maruaders.png',
    '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_convenant.png',
  ] as const

  let currentIndex = 0
  $: bannerMap = {
    'Mutated Expeditions': '/lyshineui/images/leaderboards/leaderboard_cat_bg_expeditions.png',
    'Faction War': factionImagePaths[currentIndex],
    'Vs. Environment': '/lyshineui/images/leaderboards/leaderboard_cat_bg_environment.png',
    'Vs. Players': '/lyshineui/images/leaderboards/leaderboard_cat_bg_player.png',
    'Trade Skills': '/lyshineui/images/leaderboards/leaderboard_cat_bg_trade.png',
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

  $: firstlevelcategory = LEADERBOARD_ID_MAP[id].FirstLevelCategory
  $: secondlevelcategory = LEADERBOARD_ID_MAP[id].SecondLevelCategory
  $: category = LEADERBOARD_ID_MAP[id].Category as keyof (typeof LEADERBOARD_DATA)[typeof firstlevelcategory]

  $: leaderboard = LEADERBOARD_DATA[firstlevelcategory][category][secondlevelcategory].find(
    (item: LeaderboardDefinition) => item.LeaderboardDefinitionId === id,
  ) as LeaderboardDefinition

  $: firstLevelKeys = Object.keys(LEADERBOARD_DATA[firstlevelcategory]) as (keyof typeof LEADERBOARD_DATA)[]
  $: filteredLeaderboards = LEADERBOARD_DATA[firstlevelcategory][category][secondlevelcategory].reduce(
    (acc: LeaderboardDefinition[], item: LeaderboardDefinition) => {
      if (item[data.filter] === true) {
        acc.push(item)
      }
      return acc
    },
    [],
  )
  $: leaderboards = LEADERBOARD_DATA[firstlevelcategory][category][secondlevelcategory] as LeaderboardDefinition[]
</script>

<svelte:head>
  {#if leaderboard}
    <title>
      {!isNaN(Number(leaderboard.DisplayName))
        ? `${secondlevelcategory}: ${category}, ${leaderboard.DisplayName}`
        : secondlevelcategory === leaderboard.DisplayName
        ? `${category}: ${secondlevelcategory}`
        : `${secondlevelcategory}: ${leaderboard.DisplayName}`} - Leaderboard
    </title>
    <meta
      content={!isNaN(Number(leaderboard.DisplayName))
        ? `${secondlevelcategory}: ${category}, ${leaderboard.DisplayName}`
        : secondlevelcategory === leaderboard.DisplayName
        ? `${category}: ${secondlevelcategory}`
        : `${secondlevelcategory}: ${leaderboard.DisplayName}`}
      property="og:title"
    />
    <meta
      content="Leaderboard for {!isNaN(Number(leaderboard.DisplayName))
        ? `${category}, ${leaderboard.DisplayName}`
        : leaderboard.DisplayName} in {firstlevelcategory + ' ' + category + ' ' + secondlevelcategory}"
      property="og:description"
    />
  {/if}
</svelte:head>

<div class="my-grid overflow-y relative z-20 grid max-h-full min-w-fit gap-2 overflow-x-hidden bg-base-300 px-2 py-2">
  <div
    class="col-start-1 col-end-5 row-start-2 row-end-3 grid h-full w-full grid-cols-2 grid-rows-2 place-items-center gap-2 border-2 border-base-100 p-2 md:col-end-3 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2"
  >
    <div class="join col-span-full row-start-2 row-end-3 self-start rounded-none">
      {#if $page.params.season}
        <select
          class="select join-item select-primary select-xs rounded-none uppercase sm:select-md"
          on:change={(e) => goto(e.target?.value)}
        >
          <option value="/lb/{leaderboardId}/s3" selected={$page.params.season === 's3'}>Season 3</option>
          <option value="/lb/{leaderboardId}/s2" selected={$page.params.season === 's2'}>Season 2</option>
          <option value="/lb/{leaderboardId}/s1" selected={$page.params.season === 's1'}>Season 1</option>
          <option value="/lb/{leaderboardId}/q1" selected={$page.params.season === 'q1'}>Quarter 1</option>
        </select>
      {/if}
      {#if leaderboard && filteredLeaderboards.length > 1 && leaderboards.find((item) => item[filter] === true)}
        <select
          class="select join-item select-primary select-xs rounded-none uppercase sm:select-md"
          on:change={(e) => goto(e.target?.value)}
        >
          {#each leaderboards as leaderboard}
            {#if leaderboard[data.filter]}
              <option value="/lb/{leaderboard.LeaderboardDefinitionId}/{data.currentSeason}">
                {leaderboard.DisplayName}
              </option>
            {/if}
          {/each}
        </select>
      {/if}
    </div>
    {#if leaderboard}
      {@const t = Object.values(LEADERBOARD_DATA[firstlevelcategory][category])
        //@ts-ignore
        .map((arr) => arr.filter((item) => item.CompanyLeaderboard === true))
        .some((arr) => arr.length)}
      <div class="join col-span-full row-start-1 row-end-2 place-self-center self-end rounded-none">
        <button
          class="btn join-item btn-xs text-center sm:btn-md"
          disabled={true}
          class:btn-primary={leaderboard['FactionLeaderboard']}
          on:pointerup={() => {
            data.filter = 'FactionLeaderboard'
          }}
        >
          Faction
        </button>
        <button
          class="btn join-item btn-xs text-center outline outline-transparent sm:btn-md hover:outline-primary"
          disabled={!t}
          class:btn-primary={leaderboard['CompanyLeaderboard'] === true}
          on:pointerup={() => {
            data.filter = 'CompanyLeaderboard'
          }}
        >
          {#if leaderboards}
            {@const id = leaderboards.find((item) => item['CompanyLeaderboard'] === true)?.LeaderboardDefinitionId}
            <a
              href={`/lb/${id || $page.params.lbid}/${data.currentSeason}`}
              class="flex h-full w-full place-items-center"
            >
              Company
            </a>
          {/if}
        </button>
        <button
          class="join-item btn-xs text-center outline outline-transparent sm:btn-md hover:outline-primary"
          class:btn-primary={leaderboard['CharacterLeaderboard'] === true}
          on:pointerup={() => {
            data.filter = 'CharacterLeaderboard'
          }}
        >
          {#if leaderboards}
            {@const id = leaderboards.find((item) => item['CharacterLeaderboard'] === true)?.LeaderboardDefinitionId}
            <a
              href={`/lb/${id || $page.params.lbid}/${data.currentSeason}`}
              class="flex h-full w-full place-items-center"
            >
              Character
            </a>
          {/if}
        </button>
      </div>
    {/if}
  </div>
  <div
    class=" relative col-span-full row-span-1 flex h-full w-full place-content-center border-2 border-base-100 p-2 lg:col-start-2 lg:col-end-5 lg:place-self-start"
  >
    <div class="relative max-h-min min-w-full overflow-clip border-2 border-stone-400 border-opacity-80 bg-black">
      <a href="/lb" class="" data-sveltekit-reload>
        <img
          src={`${assets}${
            //@ts-ignore
            bannerMap[firstlevelcategory || 'Mutated Expeditions']
          }`}
          alt=""
          class="h-full w-full object-cover object-right-top"
        />
        <div
          class="absolute left-0 top-0 z-10 grid h-full w-full bg-base-100 bg-opacity-25 text-2xl hover:bg-opacity-0 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
        >
          <div class="self-end px-4 py-6 text-white">
            {firstlevelcategory || 'Mutated Expeditions'}
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
    {#each firstLevelKeys as item}
      <!-- content here -->
      <div class="flex grow-0 flex-col gap-2 px-2">
        <div class="flex flex-nowrap border-b-2 border-base-100 bg-base-300 px-2 text-xl">
          {@html item.replace('/lyshineui/images', 'https://cdn.nwdb.info/db/images/live/v35')}
        </div>
        {#each Object.keys(LEADERBOARD_DATA[firstlevelcategory][item]) as subitem}
          {@const definitions =
            //@ts-ignore
            LEADERBOARD_DATA[firstlevelcategory][item][subitem]}
          <button
            disabled={!definitions.find((item) => item[filter] === true)}
            class="text-md btn relative rounded-none border-4 border-transparent p-0 text-left hover:link hover:animate-[pulse_1.5s_ease-in-out_infinite] hover:border-l-primary"
            class:btn-active={secondlevelcategory === subitem && category === item}
            class:border-l-primary={secondlevelcategory === subitem && category === item}
          >
            <a
              href={`/lb/${definitions.find((item) => item[filter] === true)?.LeaderboardDefinitionId}/${
                data.currentSeason
              }`}
              class="flex h-full w-full place-content-start place-items-center px-2 capitalize"
            >
              {subitem}
            </a>
          </button>
        {/each}
      </div>
    {/each}
  </div>
  <div
    class="my-grid-row relative col-span-full row-span-2 row-start-4 grid h-full w-full grid-cols-1 place-self-start border-2 border-base-100 md:row-span-full md:row-start-3 lg:col-start-2 lg:col-end-5 lg:row-start-2 lg:row-end-5"
  >
    {#await data.streamed.json}
      <span class="loading loading-bars loading-lg place-self-center"></span>
    {:then table}
      <!-- {@debug table} -->
      <Table {table} {id} season={$page.params.season} />
    {:catch e}
      <div class="col-span-full row-span-2 h-full w-full text-center lg:col-span-3 lg:row-span-3">
        <h1 class="h-full w-full text-3xl">No data available</h1>
      </div>
    {/await}
  </div>
</div>

<style>
  .my-grid {
    grid-template-rows:
      minmax(15vh, 0.5fr) min-content minmax(15vh, min-content)
      minmax(35vh, 1fr);
    grid-template-columns: repeat(2, minmax(min-content, auto)) repeat(2, minmax(min-content, 1fr));
  }
</style>
