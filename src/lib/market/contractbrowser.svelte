<script lang="ts">
  import type { MarketEntries } from '../market.types'
  import ContractList from './contractlist.svelte'
  import Itemfilter from './itemfilter.svelte'

  export let marketentries: MarketEntries
</script>

<div class="my-4 flex h-full w-full">
  <div class="grid">
    <Itemfilter></Itemfilter>
  </div>
  <div class="grid overflow-y-auto">
    <ContractList items={marketentries.data}></ContractList>
  </div>
</div>
