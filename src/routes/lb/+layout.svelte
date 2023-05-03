<script lang="ts">
  import { page } from '$app/stores'
  import { writable } from 'svelte/store'
  import { goto } from '$app/navigation'
  import { leaderboardMap, leaderboardIdMap } from '$lib/leaderboardmap'
  import type {
    LeaderboardType,
    LeaderboardIdMap,
    LeaderboardDefinition,
  } from '$lib/leaderboardmap'
  import type { LayoutData } from '../$types'
  import Category from '$lib/category.svelte'
  import Firstcategory from '$lib/firstcategory.svelte'
  import Secondcategory from '$lib/secondcategory.svelte'
  import Leaderboard from '$lib/leaderboard.svelte'
  import Imagebanner from '$lib/imagebanner.svelte'

  const leaderboardData: LeaderboardType = leaderboardMap
  const leaderboardMapId: LeaderboardIdMap = leaderboardIdMap
  const categories = writable({
    firstlevelcategory: '',
    category: '',
    subcategory: '',
  })

  export let data: LayoutData
  let filteredLeaderboards: LeaderboardDefinition[] = []

  $: leaderboardId = $page.params.leaderboardId || ''

  $: if (leaderboardId) {
    $categories.firstlevelcategory =
      leaderboardMapId[leaderboardId].FirstLevelCategory
    $categories.category = leaderboardMapId[leaderboardId].Category
    $categories.subcategory =
      leaderboardMapId[leaderboardId].SecondLevelCategory

    filteredLeaderboards = leaderboardData[$categories.firstlevelcategory][
      $categories.category
    ][$categories.subcategory].reduce((acc: LeaderboardDefinition[], item) => {
      if (item[data.filter] === true) {
        acc.push(item)
      }
      return acc
    }, [])
  }

  let leaderboards: LeaderboardDefinition[] = []
  $: leaderboard = leaderboards.find(
    (item) => item.LeaderboardDefinitionId === leaderboardId
  )

  $: if (
    $categories.firstlevelcategory &&
    $categories.category &&
    $categories.subcategory
  ) {
    leaderboards =
      leaderboardData[$categories.firstlevelcategory][$categories.category][
        $categories.subcategory
      ]
  }

  const hierarchy: { [key: string]: string[] } = {
    firstlevelcategory: ['category', 'subcategory', 'leaderboardId'],
    category: ['subcategory', 'leaderboardId'],
    subcategory: ['leaderboardId'],
  }

  $: if (!$categories.subcategory) {
    if ($categories.firstlevelcategory && !$categories.category) {
      const firstKey = Object.keys(
        leaderboardData[$categories.firstlevelcategory]
      )[0]
      $categories.category = firstKey
      // $categories.subcategory = leaderboardData[$categories.firstlevelcategory][firstKey][0].DisplayName
    }
    if (
      $categories.firstlevelcategory === 'Mutated Expeditions' &&
      $categories.category
    ) {
      $categories.subcategory = 'Clear Time'
      const leaderboardId = (
        leaderboardData['Mutated Expeditions'] as {
          [key: string]: { [key: string]: LeaderboardDefinition[] }
        }
      )[$categories.category][$categories.subcategory][0]
        .LeaderboardDefinitionId

      goto(`/lb/${leaderboardId}/${data.currentSeason}`)
    }

    if ($categories.firstlevelcategory === 'Faction War') {
      if ($categories.category === 'War') {
        $categories.subcategory = 'Wins'
        const leaderboardId = (
          leaderboardData['Faction War'] as {
            [key: string]: {
              [key: string]: LeaderboardDefinition[]
            }
          }
        )[$categories.category][$categories.subcategory][0]
          .LeaderboardDefinitionId

        goto(`/lb/${leaderboardId}/${data.currentSeason}`)
      }

      if ($categories.category === 'Territory Control') {
        $categories.subcategory = 'Days Governed'
        const leaderboardId = (
          leaderboardData['Faction War'] as {
            [key: string]: {
              [key: string]: LeaderboardDefinition[]
            }
          }
        )[$categories.category][$categories.subcategory][0]
          .LeaderboardDefinitionId

        goto(`/lb/${leaderboardId}/${data.currentSeason}`)
      }
    }

    if ($categories.firstlevelcategory === 'Vs. Environment') {
      if (
        $categories.category === 'Invasions' ||
        $categories.category === 'Corruption Breaches'
      ) {
        $categories.subcategory = 'Score'
        const leaderboardId = (
          leaderboardData['Vs. Environment'] as {
            [key: string]: {
              [key: string]: LeaderboardDefinition[]
            }
          }
        )[$categories.category][$categories.subcategory][0]
          .LeaderboardDefinitionId

        goto(`/lb/${leaderboardId}/${data.currentSeason}`)
      }
    }

    if ($categories.firstlevelcategory === 'Vs. Players') {
      if (
        $categories.category === 'Outpost Rush' ||
        $categories.category === '3v3 Arenas'
      ) {
        $categories.subcategory = 'Wins'
        const leaderboardId = (
          leaderboardData['Vs. Players'] as {
            [key: string]: {
              [key: string]: LeaderboardDefinition[]
            }
          }
        )[$categories.category][$categories.subcategory][0]
          .LeaderboardDefinitionId

        goto(`/lb/${leaderboardId}/${data.currentSeason}`)
      }

      if ($categories.category === 'Open World PVP') {
        $categories.subcategory = 'PvP Kills'
        const leaderboardId = (
          leaderboardData['Vs. Players'] as {
            [key: string]: {
              [key: string]: LeaderboardDefinition[]
            }
          }
        )[$categories.category][$categories.subcategory][0]
          .LeaderboardDefinitionId

        goto(`/lb/${leaderboardId}/${data.currentSeason}`)
      }
    }

    if ($categories.firstlevelcategory === 'Trade Skills') {
      $categories.category = 'Legendaries'
      $categories.subcategory = 'Weaponsmithing'
      const leaderboardId = (
        leaderboardData['Trade Skills'] as {
          [key: string]: {
            [key: string]: LeaderboardDefinition[]
          }
        }
      )[$categories.category][$categories.subcategory][0]
        .LeaderboardDefinitionId

      goto(`/lb/${leaderboardId}/${data.currentSeason}`)
    }
  }

  function clearHierarchy(targetKey: string) {
    if (hierarchy[targetKey]) {
      hierarchy[targetKey].forEach((item) => {
        ;($categories as { [key: string]: string })[item] = ''
      })
    }
  }

  function removeFocus() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }
</script>

<div
  class="my-grid rounded-box relative z-20 grid max-h-full min-w-fit place-content-center place-items-center gap-2 overflow-y-auto overflow-x-hidden bg-base-300 px-4 py-4"
>
  {#if $categories.firstlevelcategory}
    <div
      class="rounded-box z-50 col-start-1 col-end-2 row-start-1 row-end-2 hidden h-full w-full grid-cols-2 grid-rows-2 border-2 border-base-100 px-2 lg:grid"
    >
      <div
        class="btn-group col-span-full row-start-2 row-end-3 place-self-center"
      >
        <button class="dropdown no-animation btn">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <label tabindex="0" class="m-1">
            {$page.params.season
              ?.replace('s', 'Season ')
              .replace('q', 'Quarter ')}
          </label>
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <ul
            tabindex="0"
            class="dropdown-content menu rounded-box no-animation w-52 bg-base-100 p-2 text-base-content shadow"
          >
            <li><a href="/lb/{leaderboardId}/s1">Season 1</a></li>
            <li><a href="/lb/{leaderboardId}/q1">Quarter 1</a></li>
          </ul>
        </button>
        {#if leaderboard && filteredLeaderboards.length > 1 && leaderboards.find((item) => item[data.filter] === true)}
          <button class="dropdown no-animation btn">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <label tabindex="0" class="m-1">
              {leaderboard?.DisplayName || 'Leaderboards'}
            </label>
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <ul
              tabindex="0"
              class="dropdown-content menu rounded-box no-animation w-52 bg-base-100 p-2 text-base-content shadow"
            >
              {#each leaderboards as leaderboard}
                {#if leaderboard[data.filter]}
                  <li>
                    <a
                      href="/lb/{leaderboard.LeaderboardDefinitionId}/{data.currentSeason}"
                    >
                      {leaderboard.DisplayName}
                    </a>
                  </li>
                {/if}
              {/each}
            </ul>
          </button>
        {/if}
      </div>
      <div
        class="btn-group col-span-full row-start-1 row-end-2 place-self-center"
      >
        <button
          class="btn text-center"
          disabled={true}
          class:btn-active={data.filter === 'FactionLeaderboard'}
          on:pointerup={() => {
            data.filter = 'FactionLeaderboard'
          }}
        >
          Faction
        </button>
        <button
          class="btn text-center"
          disabled={!Object.keys(
            leaderboardData[$categories.firstlevelcategory][
              $categories.category
            ]
          ).some((key) =>
            leaderboardData[$categories.firstlevelcategory][
              $categories.category
            ][key].some((item) => item.CompanyLeaderboard === true)
          )}
          class:btn-active={data.filter === 'CompanyLeaderboard'}
          on:pointerup={() => {
            data.filter = 'CompanyLeaderboard'

            const id = leaderboards.find(
              (item) => item['CompanyLeaderboard'] === true
            )?.LeaderboardDefinitionId

            if (id) {
              goto(`/lb/${id}/${data.currentSeason}`)
            }
          }}
        >
          Company
        </button>
        <button
          class="btn text-center"
          class:btn-active={data.filter === 'CharacterLeaderboard'}
          on:pointerup={() => {
            data.filter = 'CharacterLeaderboard'
            const id = leaderboards.find(
              (item) => item['CharacterLeaderboard'] === true
            )?.LeaderboardDefinitionId

            if (id) {
              goto(`/lb/${id}/${data.currentSeason}`)
            }
          }}
        >
          Character
        </button>
      </div>
    </div>
  {/if}
  <Imagebanner
    {categories}
    on:selectCatergory={(e) => clearHierarchy(e.detail)}
  />
  <div
    class=" rounded-box col-span-full row-start-2 row-end-3 flex h-full w-full min-w-fit place-content-center place-items-center gap-0 border-2 border-base-100 bg-base-300 py-2 lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-5 lg:flex-col lg:place-content-start lg:place-items-start lg:gap-2 lg:overflow-y-auto {!$categories.firstlevelcategory
      ? 'lg:hidden'
      : 'lg:visible'}"
  >
    {#if $categories.firstlevelcategory}
      {#each Object.keys(leaderboardData[$categories.firstlevelcategory]) as item}
        <!-- content here -->
        <div class="rounded-box hidden w-full flex-col gap-2 px-2 lg:flex">
          <div class=" border-b-2 border-base-100 bg-base-300 px-2 text-xl">
            {item}
          </div>
          {#each Object.keys(leaderboardData[$categories.firstlevelcategory][item] || {}) as subitem}
            <button
              disabled={!leaderboardData[$categories.firstlevelcategory][item][
                subitem
              ].find((item) => item[data.filter] === true)}
              on:click={() => {
                removeFocus()
                clearHierarchy('subcategory')
                clearHierarchy('leaderboardId')
                $categories.category = item
                $categories.subcategory = subitem
                const id = leaderboardData[$categories.firstlevelcategory][
                  item
                ][subitem].find(
                  (item) => item[data.filter] === true
                )?.LeaderboardDefinitionId
                goto(`/lb/${id}/${data.currentSeason}`)
              }}
              class="btn box-border border-8 border-transparent px-6 text-left text-lg"
              class:btn-active={$categories.subcategory === subitem &&
                $categories.category === item}
              class:border-l-primary={$categories.subcategory === subitem &&
                $categories.category === item}
            >
              {subitem}
            </button>
          {/each}
        </div>
      {/each}
    {/if}
    <Firstcategory
      {categories}
      {leaderboardData}
      on:selectCategory={(e) => {
        removeFocus()
        clearHierarchy(e.detail)
      }}
    />

    <Category
      {categories}
      {leaderboardData}
      on:selectCategory={(e) => {
        removeFocus()
        clearHierarchy(e.detail)
      }}
    />

    <Secondcategory
      {categories}
      {leaderboardData}
      {data}
      on:selectCategory={(e) => {
        removeFocus()
        clearHierarchy(e.detail)
      }}
    />

    <Leaderboard
      {categories}
      {leaderboardData}
      {data}
      {leaderboardId}
      {leaderboards}
      {leaderboardIdMap}
      on:selectCategory={(e) => {
        removeFocus()
        clearHierarchy(e.detail)
      }}
    />
  </div>
  <slot />
</div>

<style>
  .my-grid {
    grid-template-rows: minmax(0, 0.5fr) minmax(0, auto) repeat(
        2,
        minmax(0, 1fr)
      );
    grid-template-columns: repeat(2, minmax(0, auto)) repeat(2, minmax(0, 1fr));
  }
</style>
