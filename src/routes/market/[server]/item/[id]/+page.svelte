<script lang="ts">
  import type { PageData } from './$types'
  import PriceChart from '$lib/market/priceChart.svelte'
  import type { MarketData } from '$lib/market.types'
  import { onMount } from 'svelte'

  export let data: PageData

  let sellOrdersUnitAmount = 0
  let buyOrdersUnitAmount = 0

  $: sellOrders = data.itemData.filter((item) => item.contractType === 1)
  $: buyOrders = data.itemData.filter((item) => item.contractType === 0)

  $: currentSellOrders = sellOrders
    .filter((item) => item.sessionDate === data.lastSession)
    .sort((a, b) => a.price - b.price)
  $: currentBuyOrders = buyOrders
    .filter((item) => item.sessionDate === data.lastSession)
    .sort((a, b) => b.price - a.price)

  $: sellOrderCap = currentSellOrders.reduce((acc, item) => acc + (item.price / 100) * item.quantity, 0)
  $: sellOrderQuantity = currentSellOrders.reduce((acc, item) => acc + item.quantity, 0)
  $: buyOrderCap = currentBuyOrders.reduce((acc, item) => acc + (item.price / 100) * item.quantity, 0)
  $: buyOrderQuantity = currentBuyOrders.reduce((acc, item) => acc + item.quantity, 0)

  function calculateCostForNUnits(items: MarketData[], n: number) {
    let unitsCount = 0
    let totalCost = 0

    for (const item of items) {
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
    sellOrdersUnitAmount = sellOrderQuantity < 50 ? sellOrderQuantity : 50
    buyOrdersUnitAmount = buyOrderQuantity < 50 ? buyOrderQuantity : 50
  })
</script>

<div class="grid max-h-full grid-cols-2 grid-rows-[auto,minmax(100px,.75fr),1fr] gap-y-4 place-content-center">
  <div class="col-span-full row-start-1 flex place-content-center">
    {data.name}
  </div>
  <div class="row-start-2 flex place-content-center place-items-center w-full">
    {#if sellOrders.length}
      <PriceChart itemData={sellOrders} title="Sell Orders"></PriceChart>
    {:else}
      No Sell Orders Info
    {/if}
  </div>
  <div class="row-start-2 flex place-content-center place-items-center w-full">
    {#if buyOrders.length}
      <PriceChart itemData={buyOrders} title="Buy Orders"></PriceChart>
    {:else}
      No Buy Orders Info
    {/if}
  </div>
  <div class="row-start-3 col-span-full">
    <table class="table table-fixed">
      <thead>
        <tr>
          <th>Type</th>
          <th>Market Cap</th>
          <th>Cost Per</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Sell Orders</td>
          <td>
            {sellOrderCap.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
          </td>
          <td>
            {calculateCostForNUnits(sellOrders, sellOrdersUnitAmount || sellOrderQuantity)}
          </td>
          <td>
            <select name="" id="" bind:value={sellOrdersUnitAmount}>
              {#if sellOrderQuantity < 50}
                <option value={sellOrderQuantity}>{sellOrderQuantity}</option>
              {/if}
              {#if sellOrderQuantity >= 50}
                <option value={50}>50</option>
              {/if}
              {#if sellOrderQuantity >= 100}
                <option value={100}>100</option>
              {/if}
              {#if sellOrderQuantity >= 500}
                <option value={500}>500</option>
              {/if}
              {#if sellOrderQuantity >= 1000}
                <option value={1000}>1000</option>
              {/if}
              {#if sellOrderQuantity >= 5000}
                <option value={5000}>5000</option>
              {/if}
              {#if sellOrderQuantity >= 10000}
                <option value={10000}>10000</option>
              {/if}
            </select>
          </td>
        </tr>
        <tr>
          <td>Buy Orders</td>
          <td>
            {buyOrderCap.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
          </td>
          <td>
            {calculateCostForNUnits(buyOrders, buyOrdersUnitAmount || buyOrderQuantity)}
          </td>
          <td>
            <select name="" id="" bind:value={buyOrdersUnitAmount}>
              {#if buyOrderQuantity < 50}
                <option value={buyOrderQuantity}>{buyOrderQuantity}</option>
              {/if}
              {#if buyOrderQuantity >= 50}
                <option value={50}>50</option>
              {/if}
              {#if buyOrderQuantity >= 100}
                <option value={100}>100</option>
              {/if}
              {#if buyOrderQuantity >= 500}
                <option value={500}>500</option>
              {/if}
              {#if buyOrderQuantity >= 1000}
                <option value={1000}>1000</option>
              {/if}
              {#if buyOrderQuantity >= 5000}
                <option value={5000}>5000</option>
              {/if}
              {#if buyOrderQuantity >= 10000}
                <option value={10000}>10000</option>
              {/if}
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
