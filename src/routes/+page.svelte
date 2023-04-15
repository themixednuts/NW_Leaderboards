<script lang="ts">
    import { page } from "$app/stores";
    import Table from "$lib/table.svelte";

    $: leaderboardId = $page.url.searchParams.get("leaderboardid");

    async function getTableData(leaderboardId: string) {
        const response = await fetch(
            `https://lb.jakel.rocks/json/${leaderboardId}/s1?size=1000`
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
