<script lang="ts">
  import type { PageData } from './$types'
  import PriceChart from '$lib/market/priceChart.svelte'
  import type { MarketData } from '$lib/market.types'
  import PriceDistribution from '$lib/market/priceDistribution.svelte'
  import type { Action } from 'svelte/action'

  export let data: PageData

  let sellOrdersUnitAmount = 0
  let buyOrdersUnitAmount = 0

  function calculateCostForNUnits(sortedItems: MarketData[], n: number) {
    let unitsCount = 0
    let totalCost = 0

    for (const item of sortedItems) {
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

  const handleSellOrderAmount: Action<HTMLElement, number> = (ele: HTMLElement, quantity: number) => {
    sellOrdersUnitAmount = quantity < 50 ? quantity : 50
  }
  const handleBuyOrderAmount: Action<HTMLElement, number> = (ele: HTMLElement, quantity: number) => {
    buyOrdersUnitAmount = quantity < 50 ? quantity : 50
  }
</script>

<div class="grid max-h-full auto-rows-max grid-cols-2 place-content-center gap-y-4 place-self-start overflow-auto">
  {#await data.streamed.item}
    <div class="loading loading-bars place-self-center justify-self-center"></div>
  {:then res}
    {@const sellOrders = res.itemData.filter((item) => item.contractType === 1)}
    {@const buyOrders = res.itemData.filter((item) => item.contractType === 0)}
    {@const currentSellOrders = sellOrders
      .filter((item) => item.sessionDate === res.lastSession)
      .sort((a, b) => a.price - b.price)}
    {@const currentBuyOrders = buyOrders
      .filter((item) => item.sessionDate === res.lastSession)
      .sort((a, b) => b.price - a.price)}
    {@const sellOrderCap = currentSellOrders.reduce((acc, item) => acc + (item.price / 100) * item.quantity, 0)}
    {@const sellOrderQuantity = currentSellOrders.reduce((acc, item) => acc + item.quantity, 0)}
    {@const buyOrderCap = currentBuyOrders.reduce((acc, item) => acc + (item.price / 100) * item.quantity, 0)}
    {@const buyOrderQuantity = currentBuyOrders.reduce((acc, item) => acc + item.quantity, 0)}
    <div class="col-span-full row-start-1 flex place-content-center">
      {res.name}
    </div>
    <div class="col-span-full">
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
              {calculateCostForNUnits(currentSellOrders, sellOrdersUnitAmount ?? sellOrderQuantity)}
            </td>
            <td>
              <select name="" id="" bind:value={sellOrdersUnitAmount} use:handleSellOrderAmount={sellOrderQuantity}>
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
              {calculateCostForNUnits(currentBuyOrders, buyOrdersUnitAmount ?? buyOrderQuantity)}
            </td>
            <td>
              <select name="" id="" bind:value={buyOrdersUnitAmount} use:handleBuyOrderAmount={buyOrderQuantity}>
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
    <div class="col-span-full flex h-[300px] w-full place-content-center place-items-center">
      {#if sellOrders.length}
        {@const maxDate = sellOrders.reduce((acc, item) => Math.max(acc, +item.sessionDate), 0)}
        <PriceDistribution itemData={sellOrders.filter((item) => +item.sessionDate === maxDate)} title="Price Histogram"
        ></PriceDistribution>
      {/if}
    </div>
    <div class="col-span-full flex max-h-[500px] min-h-[300px] w-full place-content-center place-items-center">
      {#if sellOrders.length}
        <PriceChart itemData={sellOrders} title="Sell Orders" days={res.days}></PriceChart>
      {:else}
        No Sell Orders Info
      {/if}
    </div>
    <div class="col-span-full flex max-h-[500px] min-h-[300px] w-full place-content-center place-items-center">
      {#if buyOrders.length}
        <PriceChart itemData={buyOrders} title="Buy Orders" days={res.days}></PriceChart>
      {:else}
        No Buy Orders Info
      {/if}
    </div>
  {/await}
</div>
