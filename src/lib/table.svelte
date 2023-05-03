<script lang="ts">
  export let table: LeaderboardAPIBoardItem[]
  export let id: string
  export let season: string

  import { leaderboardMap, leaderboardIdMap } from './leaderboardmap'
  import type { LeaderboardType, LeaderboardIdMap } from './leaderboardmap'

  const leaderboardData: LeaderboardType = leaderboardMap
  const leaderboardIdM: LeaderboardIdMap = leaderboardIdMap

  const firstlevelcategory = leaderboardIdM[id].FirstLevelCategory
  const category = leaderboardIdM[id].Category
  const subcategory = leaderboardIdM[id].SecondLevelCategory

  const pullDate = table[0].date

  $: data = leaderboardData[firstlevelcategory][category][subcategory].find(
    (item) => item.LeaderboardDefinitionId === id
  )

  const pageSize = Math.ceil(table.length / 10)
  const pageSizeArray = Array.from({ length: pageSize }, (_, i) => i + 1)
  let currentPage = 1
  let itemsPerPage = 10

  const pageArrayIndex = Array(itemsPerPage).fill(0)
  for (let i = 0; i < pageArrayIndex.length; i++) {
    pageArrayIndex[i] = i
  }

  const ranks = calculateRanks(table)

  function calculateRanks(data: LeaderboardAPIBoardItem[]) {
    let rank = 1
    let currentRank = 1
    let ranks = []

    for (let i = 0; i < data.length; i++) {
      if (i !== 0 && data[i - 1].value !== data[i].value) {
        rank = currentRank
      }
      ranks.push(rank)
      currentRank++
    }

    return ranks
  }

  function handleClickEvent(e: MouseEvent) {
    if (e.button !== 0) return // Only handle left click (0)
    const target = e.target as HTMLButtonElement
    currentPage = parseInt(target.innerText)
    displayPage(currentPage)
  }

  function displayPage(pageNumber: number) {
    const startIndex = (pageNumber - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    for (let i = 0; i < itemsPerPage; i++) {
      const index = startIndex + i
      if (index < table.length) {
        pageArrayIndex[i] = index
      } else {
        pageArrayIndex[i] = null // Set null if the index exceeds the array length
      }
    }
  }

  function secondsToTimeFormat(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  function getDateAndTime(date: string) {
    const dateObject = new Date(date)
    const dateOptions = {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
    } as const

    const timeOptions = {
      hour: 'numeric',
      minute: 'numeric',
    } as const
    return `${dateObject.toLocaleDateString(
      'en-US',
      dateOptions
    )} ${dateObject.toLocaleTimeString('en-US', timeOptions)}`
  }
</script>

<div
  class="my-grid-row relative col-span-full row-span-2 row-start-3 grid max-h-full grid-cols-1 place-self-start lg:col-start-2 lg:col-end-5 lg:row-start-2 lg:row-end-5"
>
  {#if data}
    <div
      class="flex w-full justify-center bg-base-300 py-4 text-2xl capitalize"
    >
      {!isNaN(Number(data.DisplayName))
        ? `${category}, ${data.DisplayName}`
        : data.DisplayName}
      {#if data.CategoryAdditionalHeader}
        <div
          class="tooltip tooltip-info hover:z-50"
          data-tip={data.CategoryAdditionalHeader.replace(/<[^>]*>/g, '')}
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
    </div>
    <div
      class="relative max-h-full min-h-[21rem] overflow-y-auto overflow-x-hidden"
    >
      <table
        class="table-zebra table-compact relative table h-full w-full table-fixed select-none md:table-normal"
      >
        <thead class="sticky top-0">
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">{data.Value}</th>
            <th scope="col">Server</th>
          </tr>
        </thead>
        <tbody>
          {#each pageArrayIndex as i}
            {#if table[i]}
              <tr>
                <td>{ranks[i]}</td>
                <td>
                  {data.Value === 'Time'
                    ? secondsToTimeFormat(table[i].value)
                    : table[i].value.toLocaleString()}
                </td>
                <td>{table[i].server}</td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
      <div
        class="absolute left-0 top-0 flex h-full w-full select-none place-content-center place-items-center place-self-center text-2xl opacity-10"
      >
        <span class="translate-x-1/4 translate-y-1/4 rotate-45">
          nwstats.info
        </span>
      </div>
    </div>

    <div class="btn-group my-0 flex justify-center place-self-center py-2">
      {#if pageSize > 5}
        <!-- Page 1 -->
        <button
          class="btn-sm btn"
          class:btn-active={currentPage === pageSizeArray[0]}
          on:pointerup={(e) => handleClickEvent(e)}
        >
          {pageSizeArray[0]}
        </button>
        <!-- Page 2 or currentPage - 1 -->
        {#if currentPage - 1 > 2 && currentPage - 1 <= pageSize - 3}
          <button
            class="btn-sm btn"
            class:btn-active={currentPage === currentPage - 1}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {currentPage - 1}
          </button>
        {:else if currentPage - 1 >= pageSize - 3}
          <button
            class="btn-sm btn"
            class:btn-active={currentPage === pageSize - 3}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {pageSize - 3}
          </button>
        {:else}
          <button
            class="btn-sm btn"
            class:btn-active={currentPage === pageSizeArray[1]}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {pageSizeArray[1]}
          </button>
        {/if}
        <!-- Page 3 or currentPage -->
        {#if currentPage > 3 && currentPage < pageSize - 1}
          <button
            class="btn-sm btn"
            class:btn-active={currentPage === currentPage}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {currentPage}
          </button>
        {:else if currentPage >= 1 && currentPage < 4}
          <button
            class="btn-sm btn"
            class:btn-active={currentPage === pageSizeArray[2]}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {pageSizeArray[2]}
          </button>
        {:else}
          <button
            class="btn-sm btn"
            class:btn-active={currentPage === pageSize - 2}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {pageSize - 2}
          </button>
        {/if}
        <!-- Page 4 or Page 5 or currentPage + 1 -->
        {#if currentPage + 1 < pageSize - 1 && currentPage + 1 > pageSizeArray[2]}
          <button
            class="btn-sm btn"
            class:btn-active={currentPage === currentPage + 1}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {currentPage + 1}
          </button>
        {:else if currentPage + 1 <= pageSizeArray[2]}
          <button
            class="btn-sm btn"
            class:btn-active={currentPage === pageSizeArray[3]}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {pageSizeArray[3]}
          </button>
        {:else}
          <button
            class="btn-sm btn"
            class:btn-active={currentPage === pageSize - 1}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {pageSize - 1}
          </button>
        {/if}
        <!-- Page 6 or last page -->
        <button
          class="btn-sm btn"
          class:btn-active={currentPage === pageSize}
          on:pointerup={(e) => handleClickEvent(e)}
        >
          {pageSize}
        </button>
      {:else}
        {#each pageSizeArray as i}
          <button
            class="btn-sm btn"
            class:btn-active={currentPage === i}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {i}
          </button>
        {/each}
      {/if}
    </div>
    <div class="flex justify-center text-sm md:text-base">
      {season.replace('s', 'Season: ').replace('q', 'Quarter: ')} - Date Pulled:
      {getDateAndTime(pullDate)}
    </div>
  {:else}
    <div>No Table</div>
  {/if}
</div>

<style>
  .my-grid-row {
    grid-template-rows: auto minmax(auto, 1fr) auto auto;
  }
</style>
