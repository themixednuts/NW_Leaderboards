<script lang="ts">
  import ContractList from '$lib/market/contractlist.svelte'
  import { endPage } from '$lib/market/stores.js'
  import { getLocalizedDate } from '$lib/utils.js'
  import type { Action } from 'svelte/action'

  export let data
  const updateaEndPage: Action<HTMLDivElement, number> = (_: HTMLDivElement, end: number) => {
    $endPage = end
  }
</script>

<div class="grid grid-rows-[1fr,min-content] min-h-0">
  <ContractList items={data.streamed.marketdata.then((res) => res.data)}></ContractList>
  {#await data.streamed.marketdata}
    <div class="place-self-end justify-self-center">
      <span>Pull Date: </span> <span class="loading loading-dots loading-xs"></span>
    </div>
  {:then marketdata}
    <div class="place-self-end justify-self-center" use:updateaEndPage={marketdata.end}>
      Pull Date: {getLocalizedDate(marketdata.sessionDate)}
    </div>
  {/await}
</div>
