<script lang="ts">
    import type { PageData } from "../$types";
    import { page } from "$app/stores";
    import Table from "$lib/table.svelte";

    $: leaderboardId = $page.url.searchParams.get("leaderboardid");

    const mappingLeaderboards: {
        [key: string]: string;
        group_gold_time_DungeonGreatCleave01_10: "/leaderboard/empyrean/s1";
        group_gold_time_DungeonBrimstoneSands00_10: "/leaderboard/ennead/s1";
        group_gold_time_DungeonCutlassKeys00_10: "/leaderboard/barnacles/s1";
        group_gold_time_DungeonEbonscale00_10: "/leaderboard/dynasty/s1";
        group_gold_time_DungeonEdengrove00_10: "/leaderboard/genesis/s1";
        group_gold_time_DungeonReekwater00_10: "/leaderboard/lazarus/s1";
        group_gold_time_DungeonRestlessShores01_10: "/leaderboard/depths/s1";
        group_gold_time_DungeonShatterMtn00_10: "/leaderboard/tempest/s1";
        group_gold_time_DungeonShatteredObelisk_10: "/leaderboard/starmine/s1";
        top_character_influence: "/leaderboard/influence/s1";
        top_character_darkness_breaches_score: "/leaderboard/corruptedbreach/s1";
    } = {
        group_gold_time_DungeonGreatCleave01_10: "/leaderboard/empyrean/s1",
        group_gold_time_DungeonBrimstoneSands00_10: "/leaderboard/ennead/s1",
        group_gold_time_DungeonCutlassKeys00_10: "/leaderboard/barnacles/s1",
        group_gold_time_DungeonEbonscale00_10: "/leaderboard/dynasty/s1",
        group_gold_time_DungeonEdengrove00_10: "/leaderboard/genesis/s1",
        group_gold_time_DungeonReekwater00_10: "/leaderboard/lazarus/s1",
        group_gold_time_DungeonRestlessShores01_10: "/leaderboard/depths/s1",
        group_gold_time_DungeonShatterMtn00_10: "/leaderboard/tempest/s1",
        group_gold_time_DungeonShatteredObelisk_10: "/leaderboard/starmine/s1",
        top_character_influence: "/leaderboard/influence/s1",
        top_character_darkness_breaches_score:
            "/leaderboard/corruptedbreach/s1",
    } as const;

    export let data: PageData;

    async function getTableData(leaderboardId: string) {
        const response = await fetch(
            `https://lb.jakel.rocks${mappingLeaderboards[leaderboardId]}?json=true&size=1000`
        );

        const data = await response.json();

        return data;
    }
</script>

{#if leaderboardId}
    {#await getTableData(leaderboardId)}
        <div>loading...</div>
    {:then tableData}
        <Table table={tableData.data} />
    {:catch error}
        <div>{error.message}</div>
    {/await}
{/if}
