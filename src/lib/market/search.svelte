<script lang="ts">
  import { page } from '$app/stores'
  import type { Action } from 'svelte/action'

  export let link: string
  export let type: string

  let search = ''
  let items: { id: string; name: string; TradingCategory: string; TradingFamily: string; TradingGroup: string }[] = []
  let searching = false

  async function getItem(id: string, controller: AbortController) {
    searching = true
    try {
      const res = await fetch(`/market/api/search/${type}/${id}`, { signal: controller.signal })
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
</script>

<div
  class="bg-search focus-within:bg-search-hover hover:bg-search-hover relative z-10 row-start-1 overflow-visible border-2 border-orange-400 border-opacity-30 bg-cover bg-center bg-no-repeat p-2"
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
      class="bg-dropdown absolute -left-0 top-12 table w-full table-fixed border-2 border-slate-500 bg-cover bg-no-repeat"
    >
      <tbody class="block max-h-[30rem] min-h-96 overflow-auto">
        {#each items as item}
          <tr class="table border-2 border-slate-800 px-2">
            <td>
              <a
                href={link
                  .replaceAll('$category', item.TradingCategory.toLowerCase())
                  .replaceAll('$family', item.TradingFamily.toLowerCase())
                  .replaceAll('$group', item.TradingGroup.toLowerCase())
                  .replaceAll('$id', item.id)}
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
