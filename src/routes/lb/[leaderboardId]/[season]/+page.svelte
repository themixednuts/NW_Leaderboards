<script lang="ts">
  import Table from '$lib/table.svelte'
  import { onMount } from 'svelte'
  import type { PageData } from './$types'
  import { navigating, page } from '$app/stores'
  import { goto } from '$app/navigation'
  import {
    leaderboardIdMap,
    leaderboardMap,
    type LeaderboardIdMap,
    type LeaderboardType,
  } from '$lib/leaderboardmap'
  import Category from '$lib/category.svelte'

  export let data: PageData

  const leaderboardIdM: LeaderboardIdMap = leaderboardIdMap
  const leaderboardM: LeaderboardType = leaderboardMap

  $: table = data.json
  $: id = data.id

  // $: console.log(data);
  // $: console.log($page.params);

  $: firstlevelcategory = leaderboardIdM[id].FirstLevelCategory
  $: secondlevelcategory = leaderboardIdM[id].SecondLevelCategory
  $: category = leaderboardIdM[id].Category
  $: leaderboard = leaderboardM[firstlevelcategory][category][
    secondlevelcategory
  ].find((item) => item.LeaderboardDefinitionId === id)

  onMount(() => {
    const currentSeason = data.currentSeason
    const validSeasons = ['q1', 's1']

    if (!validSeasons.includes($page.params.season)) {
      goto(`/lb/${$page.params.leaderboardId}/${currentSeason}`)
    }
  })
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
        : leaderboard.DisplayName} in {firstlevelcategory +
        ' ' +
        category +
        ' ' +
        secondlevelcategory}"
      property="og:description"
    />
  {/if}
</svelte:head>
{#if $navigating}
  <div class="text-center">
    <h1 class="text-3xl">Loading...</h1>
  </div>
{:else if table && table.length > 0}
  <Table {table} {id} season={$page.params.season} />
{:else}
  <div
    class="col-span-full row-span-2 h-full w-full text-center lg:col-span-3 lg:row-span-3"
  >
    <h1 class="h-full w-full text-3xl">No data available</h1>
  </div>
{/if}
