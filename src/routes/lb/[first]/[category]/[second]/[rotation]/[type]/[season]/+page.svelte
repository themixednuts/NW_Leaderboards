<script lang="ts">
  import { page } from '$app/stores'
  import Table from '$lib/leaderboard/table.svelte'
  import { CircleNotch } from 'phosphor-svelte'

  let { data } = $props()
</script>

{#await Promise.all([data.json, data.lbs])}
  <CircleNotch class="aspect-square size-12 animate-spin place-self-center" />
{:then [table, leaderboard]}
  {#if leaderboard.lb && table}
    <Table {table} leaderboard={leaderboard.lb} />
  {:else}
    <div class="place-self-center uppercase">This category is not tracked by {$page.params.type}</div>
  {/if}
{:catch e}
  <h1 class="place-self-center text-3xl">No Data</h1>
{/await}
