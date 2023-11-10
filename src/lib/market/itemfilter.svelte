<script lang="ts">
  import { page } from '$app/stores'
  import { categories } from '$lib/utils'

  // https://cdn.nwdb.info/db/images/live/v35
  const primaryCategoryIconPath = 'https://cdn.nwdb.info/db/images/live/v35/icons/itemtypes/itemtype_%s.png'
  // familyIconPath = "LyShineUI\\Images\\Icons\\Items\\Drawing\\%s.dds",
  // groupIconPath = "LyShineUI\\Images\\contracts\\contracts_tier%s.dds",

  export let filters: [string, string]

  $: header = $page.params.category
  $: server = $page.params.server
  $: type = $page.params.type
  $: family = $page.url.searchParams.get('family')
  $: group = $page.url.searchParams.get('group')
</script>

<div
  class="grid border-collapse grid-flow-row-dense auto-rows-[68px] grid-cols-[auto,1fr] gap-x-2 border-[1px] border-stone-500">
  {#each categories as [category, categoryDisplayName] (category)}
    <a
      href="/market/browser/{$page.params.server}/{$page.params.type}/{category.toLowerCase().replaceAll(' ', '')}/1"
      class="col-start-1 row-span-1 -ml-[1px] -mt-[1px] flex place-content-center place-items-center border-[1px] border-stone-500 bg-contain bg-center bg-no-repeat hover:bg-contract-category"
      class:border-r-0={header.toLowerCase() === category.toLowerCase()}
      class:bg-contract-category={header === category.toLowerCase()}>
      <img src="https://cdn.nwdb.info/db/images/live/v35/icons/itemtypes/itemtype_{category}.png" alt="" />
    </a>
  {/each}
  <div
    class="col-start-2 row-start-1 row-end-2 mr-4 flex place-content-start place-items-center border-b-[1px] border-stone-300 border-opacity-30 text-xl">
    <div class="header">{categories.find((arr) => arr[0] === header.toLowerCase())?.[1]}</div>
  </div>
  {#each filters as [filter, displayName], i}
    <a
      class="col-start-2 mr-4 flex place-items-center
       border-b-[1px] border-stone-300 border-opacity-30 bg-cover bg-center bg-no-repeat hover:bg-contract-subcategory"
      class:bg-contract-subcategory={family === filter || group === filter}
      href={header === 'all'
        ? `/market/browser/${server}/${type}/${filter.toLowerCase()}/1`
        : family
        ? `/market/browser/${server}/${type}/${header}/1?family=${family}&group=${filter}`
        : `/market/browser/${server}/${type}/${header}/1?family=${filter}`}>
      {displayName}
    </a>
  {/each}
</div>
