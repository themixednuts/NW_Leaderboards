<script lang="ts">
  import { page } from '$app/stores'
  import Itemfilter from '$lib/market/itemfilter.svelte'
  import { endPage } from '$lib/market/stores'
  import type { Action } from 'svelte/action'
  import type { LayoutData } from './$types'
  import { replaceLynshineSrc } from '$lib/utils'
  import FilterRowRange from '$lib/market/filterrowrange.svelte'
  import { applyAction, deserialize, enhance } from '$app/forms'
    import { invalidateAll } from '$app/navigation'

  export let data: LayoutData
  $: isPageStart = +$page.params.page <= 1
  $: isPageEnd = +$page.params.page >= $endPage

  let search = ''
  let items: { id: string; name: string; TradingCategory: string; TradingFamily: string; TradingGroup: string }[] = []
  let searching = false
  let filterModal: HTMLDialogElement

  const tabIcons: { [k: string]: string } = {
    Buy: '/lyshineui/images/icons/contracts/contracts_iconbuy.png',
    Sell: '/lyshineui/images/icons/contracts/contracts_iconsell.png',
  }

  async function getItem(id: string, controller: AbortController) {
    searching = true
    try {
      const res = await fetch(`/market/api/search/${id}`, { signal: controller.signal })
      items = await res.json()
    } catch (e) {
      console.log(e)
    }
    searching = false
  }

  const searchItem: Action<HTMLInputElement, string> = (ele: HTMLInputElement, search: string) => {
    let timer: NodeJS.Timeout
    let controller = new AbortController()

    return {
      destroy() {
        clearTimeout(timer)
        controller.abort()
      },
      update(id) {
        clearTimeout(timer)
        controller.abort()
        controller = new AbortController()
        if (!id) {
          searching = false
          items = []
          return
        }
        searching = true
        timer = setTimeout(getItem, 300, id, controller)
      },
    }
  }

  // const getFilteredItem = async (event: Event & { currentTarget: EventTarget & HTMLFormElement }) => {
  //   const data = new FormData(event.currentTarget)
    
  //   const price_min = data.get('price_min')
  //   const price_max = data.get('price_max')
  //   const gearscore_min = data.get('gearscore_min')
  //   const gearscore_max = data.get('gearscore_max')
  //   let str = event.currentTarget.action

  //   if(price_max) str += `&price_max=${price_max}`
  //   if(price_min) str += `&price_min=${price_min}`
  //   if(gearscore_max) str += `&gearscore_max=${gearscore_max}`
  //   if(gearscore_min) str += `&gearscore_min=${gearscore_min}`

  //   const res = await fetch(str)
  //   const result = deserialize(await res.text())

  //   await invalidateAll()
  //   applyAction(result)
  // }
</script>

<div class=" grid grid-cols-1 grid-rows-[auto,1fr] overflow-y-auto bg-cover bg-center bg-no-repeat pb-2">
  <div class="flex gap-2">
    {#each ['Buy', 'Sell'] as tab}
      <a
        class="flex h-20 w-56 place-content-center place-items-center bg-cover bg-center bg-no-repeat uppercase"
        href="/market/browser/{$page.params.server}/{tab.toLowerCase()}/{$page.params.category}/1{$page.url.search}"
      >
        <img src={tabIcons[tab]} alt="" />
        {tab}
      </a>
    {/each}
  </div>
  <div
    class="grid grid-cols-[minmax(300px,350px),1fr] grid-rows-[3rem,1fr] gap-6 overflow-y-auto bg-cover bg-center bg-no-repeat"
  >
    <div class="row-span-full grid grid-cols-1 grid-rows-[subgrid]">
      <div
        class="relative row-start-1 border-2 border-orange-400 border-opacity-30 bg-search bg-cover bg-center bg-no-repeat p-2 focus-within:bg-search-hover hover:bg-search-hover"
      >
        {#if !searching}
          <img
            src="/lyshineui/images/socialpane/icon_magnifying_glass.png"
            alt=""
            class="pointer-events-none absolute left-2 top-1/2 aspect-square -translate-y-1/2"
          />
        {:else}
          <div class="absolute left-2 top-1/2 flex -translate-y-1/2 place-content-center">
            <div class="loading"></div>
          </div>
        {/if}
        <input
          type="search"
          name=""
          id=""
          placeholder="Search"
          class="box-border h-full w-full grow border-none bg-transparent pl-8 outline-none"
          bind:value={search}
          use:searchItem={search}
        />
        {#if items.length}
          <table
            class="table -ml-2 mt-3 w-[105%] table-fixed border-2 border-slate-500 bg-dropdown bg-cover bg-no-repeat"
          >
            <tbody class="min-h-96 block max-h-[30rem] overflow-auto">
              {#each items as item}
                <tr class="table border-2 border-slate-800 px-2">
                  <td>
                    <a
                      href="/market/browser/{$page.params.server}/{$page.params
                        .type}/{item.TradingCategory.toLowerCase()}/1?family={item.TradingFamily}&group={item.TradingGroup}&item={item.id}"
                      data-sveltekit-reload
                    >
                      {item.name}
                    </a>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
      <Itemfilter filters={data.filter}></Itemfilter>
    </div>
    <div class="row-span-full grid min-h-0 w-full grid-rows-[subgrid]">
      <div class="row-start-1 flex flex-nowrap place-items-center justify-between">
        <div class="flex aspect-square h-full place-content-center place-items-center px-2">
          <!-- Open the modal using ID.showModal() method -->
          <button class="" on:click={() => filterModal.showModal()}>
            <img src={replaceLynshineSrc('/lyshineui/images/icons/misc/icon_mapfilter.png')} class="" alt="" />
          </button>
          <dialog bind:this={filterModal} class="modal animate-none rounded-none">
            <form method="GET" on:submit={() => filterModal.close()} action={$page.url.href}>
              <div
                class="bg-frame-2023 modal-box w-[600px] max-w-[700px] animate-none overflow-visible rounded-none bg-transparent bg-[length:225%] bg-[left_-7px_top_-10px] bg-no-repeat"
              >
                <div class="grid grid-cols-1 grid-rows-[auto,1fr] place-content-center place-items-center">
                  <div class="flex w-full place-content-center uppercase">filters</div>
                  <div class="flex w-full flex-col place-content-center place-items-center gap-2">
                    <FilterRowRange id="price" />
                    <FilterRowRange id="gearscore" />
                    <div class="flex w-full justify-around gap-2">
                      <button type="reset">Clear All</button>
                      <input type="submit" value="Apply" class="cursor-pointer" />
                    </div>
                  </div>
                </div>
                <div class="absolute -right-5 top-2 rotate-45">
                  <button
                    formmethod="dialog"
                    class=" h-full w-full animate-none"
                    on:click|preventDefault={() => filterModal.close()}
                  >
                    <img src="/lyshineui/images/slices/buttonclosediamond/buttonclosediamond.png" class="" alt="" />
                  </button>
                </div>
              </div>
              <div class="absolute right-0 top-0 -z-10 h-full w-full">
                <button
                  formmethod="dialog"
                  class=" h-full w-full animate-none"
                  on:click|preventDefault={() => filterModal.close()}
                ></button>
              </div>
            </form>
          </dialog>
        </div>
        <div class="flex place-items-center gap-2 px-2">
          <button class={isPageStart ? 'pointer-events-none' : ''} disabled={isPageStart}>
            <a
              href={$page.route.id
                ?.replace('[server]', $page.params.server)
                .replace('[category]', $page.params.category)
                .replace('[page]', (+$page.params.page - 1).toString())
                .replace('[type]', $page.params.type) + $page.url.search}
              class="flex h-full w-full place-items-center"
            >
              <img
                src="https://cdn.nwdb.info/db/images/live/v35/icons/misc/arrow_square.png"
                alt=""
                class="rotate-180"
                class:opacity-30={isPageStart}
              />
            </a>
          </button>
          Page {$page.params.page} of {$endPage}
          <button class={isPageEnd ? 'pointer-events-none' : ''} disabled={isPageEnd}>
            <a
              href={$page.route.id
                ?.replace('[server]', $page.params.server)
                .replace('[category]', $page.params.category)
                .replace('[page]', (+$page.params.page + 1).toString())
                .replace('[type]', $page.params.type) + $page.url.search}
              class="flex h-full w-full place-items-center"
            >
              <img
                src="https://cdn.nwdb.info/db/images/live/v35/icons/misc/arrow_square.png"
                alt=""
                class=""
                class:opacity-30={isPageEnd}
              />
            </a>
          </button>
        </div>
      </div>
      <slot />
    </div>
  </div>
</div>

<style>
  /* .bg-frame-2023 {
    background:
      url('/lyshineui/images/slices/framemultibg/framecorner.png') bottom 7px left 7px no-repeat;
  } */
</style>
