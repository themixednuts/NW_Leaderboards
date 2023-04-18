<script lang="ts">
    import { page } from "$app/stores";
    import Table from "$lib/table.svelte";

    import type { PageData } from "../$types";
    export let data: PageData;

    $: leaderboardId = data.id;
    $: bracket = $page.url.searchParams.get("bracket") || "s1";

    async function getTableData(leaderboardId: string) {
        const response = await fetch(
            `https://lb.jakel.rocks/json/${leaderboardId}/${bracket}?size=1000`
        );

        if (response.status !== 200) {
            throw new Error("Leaderboard not found");
        }
        const data = await response.json();

        return data;
    }
</script>

{#if leaderboardId}
    {#await getTableData(leaderboardId)}
        <div class="flex justify-center text-2xl">
            <button class="btn loading">loading</button>
        </div>
    {:then tableData}
        <Table table={tableData.data} id={data.id} />
    {:catch error}
        <div class="flex justify-center text-2xl">{error.message}</div>
    {/await}
{/if}
