<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/stores'
  import Search from '$lib/market/search.svelte'
  import { replaceLynshineSrc } from '$lib/utils'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<svelte:head>
  <title>NW Stats - {$page.params.server} Market</title>
  <meta content="New World Stats" property="og:title" />
  <meta content="Market {$page.params.server} Items" property="og:description" />
</svelte:head>

<div class="flex flex-col gap-4 h-full overflow-auto">
  <Search link="/market/items/{$page.params.server}/$id" type="masteritem"></Search>
  {#if browser}
    {#await fetch(`/market/api/items/${$page.params.server}`).then((res) => res.json())}
      <div class="flex place-content-center">
        <div class="loading"></div>
      </div>
    {:then items}
      <table class="table table-pin-rows max-h-full table-fixed overflow-auto">
        <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody class="overflow-auto">
          {#each items as item}
            {@const perks = item.perks?.toLowerCase()}
            <tr>
              <td>
                {item.category}
              </td>
              <td>
                <div class="flex h-full w-full place-items-center gap-2 whitespace-nowrap py-2">
                  {#if item.id}
                    <a
                      href="https://nwdb.info/db/item/{item.id?.toLowerCase()}?gs={item.gearScore}&perks={perks}"
                      class="flex aspect-square w-10 place-content-center place-items-center bg-contain bg-center bg-no-repeat
                  {`bg-item-rarity-${item.rarity ?? 0}`}"
                      target="_blank"
                    >
                      <img
                        src={replaceLynshineSrc(item.iconPath?.replaceAll('\\', '/'))}
                        alt=""
                        class="aspect-square w-[90%]"
                      />
                    </a>
                  {/if}
                  <div class="overflow-hidden">
                    {#if item.id}
                      <a href="/market/items/{$page.params.server}/{item.id}">
                        {item.name}
                      </a>
                    {:else}
                      {item.name}
                    {/if}
                  </div>
                </div>
              </td>
              <td>
                {item.value}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:catch e}
      {e}
    {/await}
  {/if}
</div>
