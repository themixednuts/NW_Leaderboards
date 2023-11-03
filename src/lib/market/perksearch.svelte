<script lang="ts">
  import { replaceLynshineSrc } from '$lib/utils'
  import type { Action } from 'svelte/action'

  export let gems: '' | 'true' | 'false' | undefined

  let search = ''
  let items: { id: string; name: string; TradingCategory: string; TradingFamily: string; TradingGroup: string }[] = []
  let searching = false
  let perks: any[] = []
  let canSearch = true

  const perkTypeMap: { [k: string]: number } = {
    Inherent: 2,
    Gem: 1,
    Generated: 0,
  }

  $: gemCount = perks.filter((perk) => perk.type === 'Gem').length
  $: perkCount = perks.filter((perk) => perk.type !== 'Gem').length

  $: {
    if (gemCount) gems = 'false'
    else gems = ''
    if (perkCount > 4 && !gemCount) gems = 'true'
    else gems = ''
    if (perkCount > 4 && gemCount) canSearch = false
    else canSearch = true
  }

  async function getItem(id: string, controller: AbortController) {
    if (!canSearch) return
    searching = true
    try {
      const res = await fetch(
        `/market/api/search/perks/${id}${gems === 'false' || gems === 'true' ? `?gem=${gems}` : ''}`,
        { signal: controller.signal },
      )
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

  function addToPerks(item: {}) {
    perks.push(item)
    perks = perks
    search = ''
  }
  function removeFromPerks(idx: number) {
    perks.splice(idx, 1)
    perks = perks
  }
</script>

<label for="perks">Perks</label>
<div
  class="relative z-10 row-start-1 overflow-visible border-2 border-orange-400 border-opacity-30 bg-search bg-cover bg-center bg-no-repeat p-2 focus-within:bg-search-hover hover:bg-search-hover"
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
    id="perks"
    placeholder="Search"
    class="box-border h-full w-full grow border-none bg-transparent pl-8 outline-none"
    bind:value={search}
    use:searchItem={search}
  />
  {#if items.length}
    <table
      class="table absolute -left-0 top-12 w-full table-fixed border-2 border-slate-500 bg-dropdown bg-cover bg-no-repeat"
    >
      <tbody class="min-h-96 block max-h-[30rem] overflow-auto">
        {#each items as item}
          <tr class="table border-2 border-slate-800 px-2">
            <td>
              <button on:click|preventDefault={() => addToPerks(item)} class="text-left">
                {item.name}
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
{#if perks.length}
  <div class="flex flex-wrap gap-4">
    {#each perks.sort((a, b) => perkTypeMap[b.type] - perkTypeMap[a.type]) as perk, i (i)}
      <div class="flex gap-2">
        <!-- <a href="https://nwdb.info/db/perk/{perk.id}" class=" z-50"> -->
        <img src={replaceLynshineSrc(perk.IconPath)} class="aspect-square w-6" alt="" />
        <!-- </a> -->
        <div>{perk.name}</div>
        <button on:click|preventDefault={() => removeFromPerks(i)} class="">
          <img src={replaceLynshineSrc('lyshineui/images/icons/misc/icon_close_mini.png')} alt="" />
        </button>
      </div>
    {/each}
  </div>
{/if}
<div class="flex gap-2">
  <div class:text-red-300={gemCount}>
    Gems: {gemCount} / 1
  </div>
  <div class:text-red-300={perkCount > 4}>
    Perks: {perkCount} / 5
  </div>
</div>
<input type="hidden" name="perks" value={perks.map((perk) => perk.id).join(',')} />
