<script lang="ts">
  import { page } from '$app/stores'
  import Table from '$lib/leaderboard/table.svelte'

  let { data } = $props()
</script>

{#await Promise.all([data.json, data.lbs])}
  <span class="loading loading-bars loading-lg place-self-center"></span>
{:then [table, leaderboard]}
  {#if leaderboard.lb && table}
    <Table {table} leaderboard={leaderboard.lb} />
  {:else}
    <div class="place-self-center uppercase">This category is not tracked by {$page.params.type}</div>
  {/if}
{:catch e}
  <h1 class="place-self-center text-3xl">No Data</h1>
{/await}
