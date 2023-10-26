<script lang="ts">
  import type { PageData } from './$types'
  import PriceChart from '$lib/market/priceChart.svelte'
  import type { MarketData } from '$lib/market.types'
    import { onMount } from 'svelte'

  export let data: PageData

  let unitAmount = 0

  $: sellOrders = data.itemData.filter((item) => item.contractType === 1)
  $: buyOrders = data.itemData.filter((item) => item.contractType === 0)
  $: sellOrderCap = sellOrders
    .filter((item) => item.sessionDate === data.lastSession)
    .reduce((acc, item) => acc + (item.price / 100) * item.quantity, 0)
  $: sellOrderQuantity = sellOrders
    .filter((item) => item.sessionDate === data.lastSession)
    .reduce((acc, item) => acc + item.quantity, 0)
  $: buyOrderCap = buyOrders
    .filter((item) => item.sessionDate === data.lastSession)
    .reduce((acc, item) => acc + (item.price / 100) * item.quantity, 0)
  $: buyOrderQuantity = buyOrders
    .filter((item) => item.sessionDate === data.lastSession)
    .reduce((acc, item) => acc + item.quantity, 0)

  function calculateCostForNUnits(items: MarketData[], n: number) {
    let unitsCount = 0
    let totalCost = 0

    const currentItems = items.filter((item) => item.sessionDate === data.lastSession)

    for (const item of currentItems) {
      const { price, quantity } = item
      const remainingQuantity = Math.min(n - unitsCount, quantity)
      const cost = remainingQuantity * (price / 100)

      unitsCount += remainingQuantity
      totalCost += cost

      if (unitsCount >= n) {
        break // Stop when you reach the desired number of units (1,000 in this case)
      }
    }

    return totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  onMount(() => {
    unitAmount = sellOrderQuantity < 1000 ? sellOrderQuantity : 1000
  })
</script>

<div class="grid max-h-full grid-cols-2 grid-rows-[auto,1fr]">
  <div class="">
    {data.name}
  </div>
  <div class="">
    <table class="table table-fixed">
      <thead>
        <tr>
          <th>Type</th>
          <th>Market Cap</th>
          <th>
            Cost Per
            <select name="" id="" bind:value={unitAmount}>
              {#if sellOrderQuantity < 1000}
              <option value={sellOrderQuantity} selected>{sellOrderQuantity}</option>
              {/if}
              {#if sellOrderQuantity >= 1000}
                <option value={1000} selected>1000</option>
              {/if}
              {#if sellOrderQuantity >= 5000}
                <option value={5000}>5000</option>
              {/if}
              {#if sellOrderQuantity >= 10000}
                <option value={10000}>10000</option>
              {/if}
            </select>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Sell Orders</td>
          <td>
            {sellOrderCap.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
          </td>
          <td>
            {calculateCostForNUnits(sellOrders, unitAmount || sellOrderQuantity)}
          </td>
        </tr>
        <tr>
          <td>Buy Orders</td>
          <td>
            {buyOrderCap.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
          </td>
          <td>
            {calculateCostForNUnits(buyOrders, unitAmount || buyOrderQuantity)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="row-start-2 flex place-content-center place-items-center">
    {#if sellOrders.length}
      <PriceChart itemData={sellOrders} title="Sell Orders"></PriceChart>
    {:else}
      No Sell Orders Info
    {/if}
  </div>
  <div class="row-start-2 flex place-content-center place-items-center">
    {#if buyOrders.length}
      <PriceChart itemData={buyOrders} title="Buy Orders"></PriceChart>
    {:else}
      No Buy Orders Info
    {/if}
  </div>
</div>
