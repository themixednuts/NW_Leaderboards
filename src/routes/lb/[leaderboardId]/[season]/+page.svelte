<script lang="ts">
    import Table from "$lib/table.svelte";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { leaderboardIdMap, leaderboardMap } from "$lib/leaderboardmap";

    export let data: PageData;

    const table = data.json;
    const id = data.id;

    const firstlevelcategory = leaderboardIdMap[id].FirstLevelCategory;
    const secondlevelcategory = leaderboardIdMap[id].SecondLevelCategory;
    const category = leaderboardIdMap[id].Category;
    const leaderboard = leaderboardMap[firstlevelcategory][category][
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
    <meta
        content="{!isNaN(Number(leaderboard.DisplayName))
            ? `${category}, ${leaderboard.DisplayName}`
            : leaderboard.DisplayName}}"
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
{#if table && table.length > 0}
    <Table {table} {id} season={$page.params.season} />
{:else}
    <div class="text-center">
        <h1 class="text-3xl">No data available</h1>
    </div>
{/if}
