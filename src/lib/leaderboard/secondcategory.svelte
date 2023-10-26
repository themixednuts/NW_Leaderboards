<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { PageData } from '../routes/$types'
  import { goto } from '$app/navigation'
  import type { LeaderboardType } from './leaderboardmap'

  export let categories
  export let leaderboardData: LeaderboardType
  export let data: PageData

  const dispatch = createEventDispatcher()

  function handleEvent() {
    dispatch('selectCategory', 'secondlevelcategory')
  }
</script>

{#if $categories.firstlevelcategory && $categories.category}
  <div class="relative flex lg:hidden">
    <div class="dropdown dropdown-end">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn-xs md:btn-sm">
        {$categories.subcategory || 'Sub Category'}
      </label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="min-h-24 small-scrollbar dropdown-content menu rounded-box max-h-[35vh] w-52 flex-nowrap overflow-y-auto overflow-x-hidden bg-base-100 p-2 shadow {$categories.subcategory
          ? 'left-1/2 -translate-x-1/2'
          : 'dropdown-end'}">
        {#each Object.keys(leaderboardData[$categories.firstlevelcategory][$categories.category]) as categoryKeys}
          <li>
            <button
              class=" text-left {$categories.subcategory === categoryKeys ? 'active' : ''}"
              on:pointerup={(e) => {
                if (e.button !== 0) {
                  return
                }
                $categories.subcategory = categoryKeys
                handleEvent()
                if (
                  leaderboardData[$categories.firstlevelcategory][$categories.category][$categories.subcategory]
                    .length === 1
                ) {
                  goto(
                    `/lb/${
                      leaderboardData[$categories.firstlevelcategory][$categories.category][$categories.subcategory][0]
                        .LeaderboardDefinitionId
                    }/${data.currentSeason}`,
                  )
                }
              }}>
              {categoryKeys}
            </button>
          </li>
        {/each}
      </ul>
    </div>
    <div
      class="absolute bottom-0 h-[5%] w-[100%] grow {!$categories.subcategory ||
      ($categories.subcategory &&
        leaderboardData[$categories.firstlevelcategory][$categories.category][$categories.subcategory]?.length === 1)
        ? 'bg-accent'
        : ''}" />
  </div>
{/if}
