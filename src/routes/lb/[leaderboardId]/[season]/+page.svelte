<script lang="ts">
  import Table from "$lib/table.svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { navigating, page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { leaderboardIdMap, leaderboardMap } from "$lib/leaderboardmap";

  export let data: PageData;

  $: table = data.json;
  $: id = data.id;

  // $: console.log(data);
  // $: console.log($page.params);

  $: firstlevelcategory = leaderboardIdMap[id].FirstLevelCategory;
  $: secondlevelcategory = leaderboardIdMap[id].SecondLevelCategory;
  $: category = leaderboardIdMap[id].Category;
  $: leaderboard = leaderboardMap[firstlevelcategory][category][
    secondlevelcategory
  ].find((item) => item.LeaderboardDefinitionId === id);

  onMount(() => {
    const currentSeason = data.currentSeason;
    const validSeasons = ["q1", "s1"];

    if (!validSeasons.includes($page.params.season)) {
      goto(`/lb/${$page.params.leaderboardId}/${currentSeason}`);
    }
  });
</script>

<svelte:head>
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
</svelte:head>
{#if $navigating}
  <div class="text-center">
    <h1 class="text-3xl">Loading...</h1>
  </div>
{:else if table && table.length > 0}
  <Table {table} {id} season={$page.params.season} />
{:else}
  <div class="text-center">
    <h1 class="text-3xl">No data available</h1>
  </div>
{/if}
