<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { LeaderboardType } from './leaderboardmap'

  export let categories
  export let leaderboardData: LeaderboardType

  const dispatch = createEventDispatcher()

  function handleEvent() {
    dispatch('selectCategory', 'firstlevelcategory')
  }
</script>

<div class="dropdown lg:hidden">
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label tabindex="0" class="btn-xs btn m-1 md:btn-sm">
    {$categories.firstlevelcategory || 'Main Section'}
  </label>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <ul
    tabindex="0"
    class="min-h-24 small-scrollbar dropdown-content menu rounded-box max-h-[35vh] w-52 flex-nowrap overflow-y-auto overflow-x-hidden bg-base-100 p-2 shadow"
  >
    {#each Object.keys(leaderboardData) as categoryKeys}
      <li>
        <button
          class=" {$categories.firstlevelcategory === categoryKeys
            ? 'active'
            : ''}"
          on:pointerup={(e) => {
            if (e.button !== 0) {
              return
            }
            $categories.firstlevelcategory = categoryKeys
            handleEvent()
          }}
        >
          {categoryKeys}
        </button>
      </li>
    {/each}
  </ul>
  <div
    class="absolute bottom-0 -z-10 h-[5%] w-[100%] grow {!$categories.firstlevelcategory
      ? 'bg-accent'
      : ''}"
  />
</div>
