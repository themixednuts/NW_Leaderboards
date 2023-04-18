<script lang="ts">
    import Table from "$lib/table.svelte";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    export let data: PageData;

    const table = data.json;
    const id = data.id;

    onMount(() => {
        const currentSeason = data.currentSeason;
        const validSeasons = ["q1", "s1"];

        if (!validSeasons.includes($page.params.season)) {
            goto(`/lb/${$page.params.leaderboardId}/${currentSeason}`);
        }
    });
</script>

{#if table && table.length > 0}
    <Table {table} {id} />
{/if}
