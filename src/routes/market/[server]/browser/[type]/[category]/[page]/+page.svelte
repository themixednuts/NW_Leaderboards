<script lang="ts">
  import ContractList from '$lib/market/contractlist.svelte'
  import { endPage } from '$lib/market/stores.js'
  import { getLocalizedDate } from '$lib/utils.js'

  export let data
  $: console.log(data)
  $: $endPage = data.marketdata.end
</script>

<div class="grid min-h-0">
  <ContractList items={data.marketdata.data}></ContractList>
  <div class="place-self-center">
    Pull Date: {getLocalizedDate(data.marketdata.sessionDate)}
  </div>
</div>
