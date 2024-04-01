<script lang="ts">
  import { page } from '$app/stores'
  import Table from '$lib/leaderboard/table.svelte'
  import { CircleNotch } from 'phosphor-svelte'
  import type { PageData } from './$types.js'

  interface Props {
    data: PageData
  }
  let { data }: Props = $props()
</script>

{#await Promise.all([data.info, data.lbs])}
  <CircleNotch class="aspect-square size-12 animate-spin place-self-center" />
{:then [table, leaderboard]}
  {#if leaderboard.leaderboards && table.json && table.leaderboard}
    {#await table.json}
      <CircleNotch class="aspect-square size-12 animate-spin place-self-center" />
    {:then json}
      <Table table={json} leaderboard={table.leaderboard} />
    {/await}
  {:else}
    <div class="place-self-center uppercase">This category is not tracked by {$page.params.type}</div>
  {/if}
{:catch}
  <h1 class="place-self-center text-3xl">No Data</h1>
{/await}
