<script lang="ts">
  import DonutChart from '$lib/market/donutChart.svelte'
  import type { PageData } from './$types'
  import BarChart from '$lib/market/barchart.svelte'

  export let data: PageData
</script>

<div class="grid auto-rows-auto grid-cols-2 gap-y-10 overflow-y-auto">
  <div class="col-span-full">
    <BarChart marketcaps={data.marketcaps}></BarChart>
  </div>
  {#each data.servers as server}
    <table class="table col-span-full table-fixed">
        <caption class="caption-top text-center">
            <a href="/market/browser/{server.toLowerCase().replaceAll(' ', '')}/buy/all/1">{server}</a>
        </caption>
      <thead>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="relative h-64">
              <DonutChart
                categories={data.catergoryVolume.filter(
                  (row) => row.server == server.toLowerCase().replaceAll(' ', ''),
                )}
              ></DonutChart>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  {/each}
</div>
