<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { PageData } from '../routes/$types'
  import { goto } from '$app/navigation'
  import type {
    LeaderboardDefinition,
    LeaderboardIdMap,
    LeaderboardType,
  } from './leaderboardmap'

  export let categories
  export let leaderboardData: LeaderboardType
  export let data: PageData
  export let leaderboardId: string
  export let leaderboards: LeaderboardDefinition[]
  export let leaderboardIdMap: LeaderboardIdMap

  const dispatch = createEventDispatcher()

  function handleEvent() {
    dispatch('selectCategory', 'secondlevelcategory')
  }
</script>

{#if $categories.firstlevelcategory && $categories.category && $categories.subcategory && leaderboards && leaderboards.length > 1}
  <div class="relative flex place-content-center rounded-md lg:hidden">
    <div class="dropdown dropdown-end grow">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-label-has-associated-control -->

      <label tabindex="0" class="btn-xs btn m-1 md:btn-sm">
        <div class="flex flex-col">
          {#if leaderboardId && leaderboards.find((item) => item.LeaderboardDefinitionId === leaderboardId)?.DisplayName === $categories.subcategory}
            <div class="">
              {leaderboards.find(
                (item) => item.LeaderboardDefinitionId === leaderboardId
              )?.CharacterLeaderboard
                ? 'Character'
                : leaderboards.find(
                    (item) => item.LeaderboardDefinitionId === leaderboardId
                  )?.CompanyLeaderboard
                ? 'Company'
                : ''}
            </div>
          {:else if leaderboardId && leaderboards.find((item) => item.LeaderboardDefinitionId === leaderboardId)?.DisplayName !== $categories.subcategory}
            {#if leaderboards.find((item) => item.LeaderboardDefinitionId === leaderboardId)}
              {leaderboards.find(
                (item) => item.LeaderboardDefinitionId === leaderboardId
              )?.DisplayName}
            {:else}
              {leaderboardData[$categories.firstlevelcategory][
                $categories.category
              ][$categories.subcategory][0].DisplayName}
            {/if}
          {:else}
            Leaderboards
          {/if}
        </div>
      </label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="min-h-24 small-scrollbar dropdown-end dropdown-content menu rounded-box max-h-[35vh] w-52 flex-nowrap overflow-y-auto overflow-x-hidden bg-base-100 p-2 shadow"
      >
        {#each Object.values(leaderboards) as categoryKeys, i}
          <li>
            <button
              class={leaderboardId === categoryKeys.LeaderboardDefinitionId
                ? 'active'
                : ''}
              on:pointerup={(e) => {
                if (e.button !== 0) {
                  return
                }
                goto(
                  `/lb/${categoryKeys.LeaderboardDefinitionId}/${data.currentSeason}`
                )
              }}
            >
              <div class="flex">
                {categoryKeys.DisplayName}
              </div>
              {#if categoryKeys.CharacterLeaderboard || categoryKeys.CompanyLeaderboard}
                <div
                  class="tooltip tooltip-info px-0 {i == 0
                    ? 'tooltip-bottom'
                    : ''}"
                  data-tip={categoryKeys.CharacterLeaderboard
                    ? 'Character'
                    : categoryKeys.CompanyLeaderboard
                    ? 'Company'
                    : ''}
                >
                  <!-- .replace(/(\<.*\>)/g, "") -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="h-4 w-4 stroke-current"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    </div>
    <div
      class="absolute bottom-0 -z-10 h-[5%] w-[100%] grow {leaderboardIdMap[
        leaderboardId
      ]?.Category === $categories.category &&
      leaderboardIdMap[leaderboardId].SecondLevelCategory ===
        $categories.subcategory
        ? 'bg-accent'
        : ''} "
    />
  </div>
{/if}
