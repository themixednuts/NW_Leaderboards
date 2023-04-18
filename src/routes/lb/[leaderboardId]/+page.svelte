<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    export let data: PageData;
    onMount(() => {
        goto(`${$page.params.leaderboardId}/${data.currentSeason}`);
    });
</script>
