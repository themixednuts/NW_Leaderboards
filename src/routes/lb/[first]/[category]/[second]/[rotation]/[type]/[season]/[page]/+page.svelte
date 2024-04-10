<script lang="ts">
  import { navigating, page } from '$app/stores'
  import Table from '$lib/leaderboard/table.svelte'
  import { CircleNotch } from 'phosphor-svelte'
  import type { PageData } from './$types.js'

  interface Props {
    data: PageData
  }
  let { data }: Props = $props()

  let json: Awaited<(typeof data)['json']> | undefined = $state()
  let error = $state(false)

  //@ts-expect-error
  $effect(async () => {
    try {
      error = false
      json = await data.json
    } catch (e) {
      error = true
      json = undefined
    }
  })
</script>

{#if error}
  <h1 class="place-self-center text-3xl">No Data</h1>
{:else if json == undefined}
  <CircleNotch class="aspect-square size-12 animate-spin place-self-center" />
{:else if data.leaderboards && data.leaderboard}
  <Table table={json} leaderboard={data.leaderboard} />
{:else}
  <div class="place-self-center uppercase">This category is not tracked by {$page.params.type}</div>
{/if}
