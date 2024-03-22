<script lang="ts">
  import { page } from '$app/stores'
  import Table from '$lib/leaderboard/table.svelte'
  import type { LeaderboardData } from '$lib/leaderboard/types'

  let { data } = $props()
  let leaderboard: LeaderboardData | undefined = $state()

  async function setLeaderboard(lb: (typeof data)['lbs']) {
    leaderboard = (await lb).lb
  }
  $inspect(leaderboard)

  $effect(() => {
    setLeaderboard(data.lbs)
  })
</script>

{#await data.json}
  <span class="loading loading-bars loading-lg place-self-center"></span>
{:then table}
  {#if leaderboard && table}
    <Table {table} {leaderboard} />
  {:else}
    <div class="place-self-center uppercase">This category is not tracked by {$page.params.type}</div>
  {/if}
{:catch e}
  <div class="col-span-full row-span-2 h-full w-full text-center lg:col-span-3 lg:row-span-3">
    <h1 class="h-full w-full text-3xl">{e}</h1>
  </div>
{/await}
