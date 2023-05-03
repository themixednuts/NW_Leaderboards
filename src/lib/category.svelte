<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { LeaderboardType } from './leaderboardmap'

  export let categories
  export let leaderboardData: LeaderboardType

  const dispatch = createEventDispatcher()

  function handleEvent() {
    dispatch('selectCategory', 'category')
  }
</script>

{#if $categories.firstlevelcategory}
  <div class="dropdown lg:hidden">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label
      tabindex="0"
      class="btn-xs btn m-1 md:btn-sm {!$categories.category
        ? ' border-b-accent'
        : ''}">
      {$categories.category || 'Category'}
    </label>
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <ul
      tabindex="0"
      class="min-h-24 small-scrollbar dropdown-content menu rounded-box left-1/2 max-h-[35vh] w-52 -translate-x-1/2 flex-nowrap overflow-y-auto overflow-x-hidden bg-base-100 p-2 shadow">
      {#each Object.keys(leaderboardData[$categories.firstlevelcategory]) as categoryKeys}
        <li>
          <button
            class=" text-start {$categories.category === categoryKeys
              ? 'active'
              : ''}"
            on:pointerup={(e) => {
              if (e.button !== 0) {
                return
              }
              $categories.category = categoryKeys
              handleEvent()
            }}>
            {categoryKeys}
          </button>
        </li>
      {/each}
    </ul>
  </div>
{/if}
