<script lang="ts">
  import DonutChart from '$lib/market/donutChart.svelte'
  import type { PageData } from './$types'
  import BarChart from '$lib/market/barchart.svelte'
  import { replaceLynshineSrc } from '$lib/utils'
  import { onMount } from 'svelte'

  export let data: PageData

  const categoryOrder = {
    price: 1,
    quantity: 2,
    unique: 3,
    tradingpost: 4,
  }

  type Stats = Awaited<PageData['streamed']['stats']>[number]

  function mySort(a: Stats, b: Stats) {
    if (a.server !== b.server) {
      return a.server.localeCompare(b.server)
    } else {
      const aOrder = categoryOrder[a.category as keyof typeof categoryOrder]
      const bOrder = categoryOrder[b.category as keyof typeof categoryOrder]

      if (aOrder && bOrder) {
        return aOrder - bOrder
      } else if (aOrder) {
        return -1
      } else if (bOrder) {
        return 1
      } else {
        return a.category.localeCompare(b.category)
      }
    }
  }

  let statItems: { [k: string]: Stats[] } = {}
  const formatter = new Intl.NumberFormat(undefined, {
    notation: 'compact',
    compactDisplay: 'short',
  })
  onMount(async () => {
    const stats = await data.streamed.stats
    stats.sort(mySort).forEach((stat) => {
      statItems[stat.server] ??= []
      statItems[stat.server].push(stat)
      if (stat.fallback) statItems[stat.server].push(stat)
    })
    statItems = statItems
  })
</script>

<div class="grid auto-rows-max grid-cols-2 place-items-center gap-y-10 overflow-y-auto">
  {#await data.streamed.items}
    <div class="loading loading-bars col-span-full"></div>
  {:then items}
    <div class="col-span-full h-full w-full">
      <BarChart marketcaps={items.marketcaps}></BarChart>
    </div>
    {#each data.servers as server, i}
      <table class="table col-span-full table-fixed">
        <caption class="caption-top text-center uppercase">
          <a href="/market/browser/{server.toLowerCase().replaceAll(' ', '')}/buy/all/1">{server}</a>
        </caption>
        <thead>
          <tr class="text-center">
            <th>Quantity Per Category</th>
            <th>Highest Price</th>
            <th>Highest Quantity</th>
            <th>Most Unique Listing</th>
            <th>Location w/ Most Listings</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="relative flex h-64 place-content-center place-items-center">
                <DonutChart
                  categories={items.catergoryVolume.filter(
                    (row) => row.server == server.toLowerCase().replaceAll(' ', ''),
                  )}
                ></DonutChart>
              </div>
            </td>
            {#if statItems[server]}
              {#each statItems[server] as item, k}
              {@const perks = item.perks?.toLowerCase()}
              {@const length = statItems[server].length}
                <td class="text-center">
                  {#if (item.category === 'price' && k % length === 0) || (item.category === 'quantity' && k % length === 1) || ((item.category === 'unique' || item.fallback) && k % length === 2) || (item.category === 'tradingpost' && k % length === 3)}
                    <div
                      class="flex h-full w-full place-content-center place-items-center gap-2 whitespace-nowrap py-2"
                    >
                      {#if item.id}
                        <a
                          href="https://nwdb.info/db/item/{item.id?.toLowerCase()}?gs={item.gearScore}&perks={perks}"
                          class="flex aspect-square w-10 shrink-0 place-content-center place-items-center bg-contain bg-center bg-no-repeat
                        {`bg-item-rarity-${item.rarity ?? 0}`}"
                          target="_blank"
                        >
                          <img
                            src={replaceLynshineSrc(item.iconPath?.replaceAll('\\', '/'))}
                            alt=""
                            class="aspect-square w-[90%] shrink-0"
                          />
                        </a>
                      {/if}
                      <div class="overflow-hidden">
                        {#if item.id}
                          <a href="/market/items/{server}/{item.id}">
                            {item.name}
                          </a>
                        {:else}
                          {item.name}
                        {/if}
                      </div>
                    </div>
                    <div class="">
                      {formatter.format(item.category === 'quantity' && k === 2 ? item.fallback || 0 : item.value)}
                    </div>
                  {:else}
                    Missing
                  {/if}
                </td>
              {/each}
            {:else}
              <td colspan="4" class="text-center">No Data :(</td>
            {/if}
          </tr>
        </tbody>
      </table>
    {/each}
  {/await}
</div>
