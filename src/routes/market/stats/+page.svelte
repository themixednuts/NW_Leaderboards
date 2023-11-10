<script lang="ts">
  import DonutChart from '$lib/market/donutChart.svelte'
  import type { PageData } from './$types'
  import BarChart from '$lib/market/barchart.svelte'
  import { browser } from '$app/environment'
  import { replaceLynshineSrc } from '$lib/utils'

  export let data: PageData

  const formatter = new Intl.NumberFormat(undefined, {
    notation: 'compact',
    compactDisplay: 'short',
  })
</script>

<div class="grid auto-rows-auto grid-cols-2 gap-y-10 overflow-y-auto">
  <div class="col-span-full">
    <BarChart marketcaps={data.marketcaps}></BarChart>
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
          <th>Location w/ Most Listings</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="relative flex h-64 place-content-center place-items-center">
              <DonutChart
                categories={data.catergoryVolume.filter(
                  (row) => row.server == server.toLowerCase().replaceAll(' ', ''),
                )}
              ></DonutChart>
            </div>
          </td>
          {#if browser}
            {#await fetch(`/market/api/items/${server.toLowerCase()}`).then((res) => res.json())}
              <td class="h-full text-center">
                <div class="loading"></div>
              </td>
            {:then items}
              {#each items as item}
                {@const perks = item.perks?.toLowerCase()}
                <td class="text-center">
                  <div class="flex h-full w-full place-content-center place-items-center gap-2 whitespace-nowrap py-2">
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
                    {formatter.format(item.value)}
                  </div>
                </td>
              {/each}
            {/await}
          {/if}
        </tr>
      </tbody>
    </table>
  {/each}
</div>
