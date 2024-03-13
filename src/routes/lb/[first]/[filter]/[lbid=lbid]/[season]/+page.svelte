<script lang="ts">
  import Table from '$lib/leaderboard/table.svelte'
  import { page } from '$app/stores'

  let { data } = $props()
</script>

{#await data.json}
  <span class="loading loading-bars loading-lg place-self-center"></span>
{:then table}
  <!-- <Table {table} {id} season={$page.params.season} /> -->
{:catch e}
  <div class="col-span-full row-span-2 h-full w-full text-center lg:col-span-3 lg:row-span-3">
    <h1 class="h-full w-full text-3xl">{e}</h1>
  </div>
{/await}
