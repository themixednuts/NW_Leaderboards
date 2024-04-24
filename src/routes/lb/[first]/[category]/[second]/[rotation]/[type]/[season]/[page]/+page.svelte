<script lang="ts">
  import { page } from '$app/stores'
  import Table from '$lib/leaderboard/table.svelte'
  import type { PageData } from './$types.js'

  interface Props {
    data: PageData
  }
  let { data }: Props = $props()
</script>

{#if data.leaderboards && data.leaderboard}
  <Table json={data.json} leaderboard={data.leaderboard} />
{:else}
  <div class="place-self-center uppercase">This category is not tracked by {$page.params.type}</div>
{/if}
