<script lang="ts">
  import { LEADERBOARD_DATA, LEADERBOARD_ID_MAP, type LeaderboardDefinition } from './leaderboardmap'
  import { replaceLynshineSrc, appendPngToSrc } from '$lib/utils'

  export let table: LeaderboardAPIBoardItem[]
  export let id: keyof typeof LEADERBOARD_ID_MAP
  export let season: string

  const { FirstLevelCategory, SecondLevelCategory, Category } = LEADERBOARD_ID_MAP[id]

  const pullDate = table[0].date

  let data: LeaderboardDefinition
  //@ts-expect-error
  $: data = LEADERBOARD_DATA?.[FirstLevelCategory]?.[Category]?.[SecondLevelCategory]?.find(
    (item: LeaderboardDefinition) => item.LeaderboardDefinitionId === id,
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
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
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
    return `${dateObject.toLocaleDateString('en-US', dateOptions)} ${dateObject.toLocaleTimeString(
      'en-US',
      timeOptions,
    )}`
  }
</script>

<div class="grid grid-cols-1 grid-rows-[auto,1fr,auto]">
  {#if data}
    <div
      class="relative flex w-full place-items-center justify-center bg-base-300 py-4 text-2xl capitalize lg:text-4xl">
      {@html replaceLynshineSrc(data.Category)}
      - {!isNaN(Number(data.DisplayName)) ? `${Category}, ${data.DisplayName}` : data.DisplayName}
      {#if data.CategoryAdditionalHeader}
        <div class="flex h-2/5 place-items-end gap-[2px] pl-2 text-sm">
          {@html appendPngToSrc(data.CategoryAdditionalHeader)
            .replace('scale="2.0"', 'height="24" width="24"')
            .replace('lys', '/lys')}
        </div>
      {/if}
    </div>
    <div class="flex flex-col overflow-y-auto overflow-x-hidden">
      <table
        class=" table table-zebra table-pin-rows table-sm relative table-fixed select-none sm:table-md md:table-lg">
        <thead class="">
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
                  {data.Value === 'Time' ? secondsToTimeFormat(table[i].value) : table[i].value.toLocaleString()}
                </td>
                <td>{table[i].server}</td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
      <div class="absolute left-1/2 top-1/2 flex -translate-x-[25%] translate-y-[25%] select-none text-2xl opacity-20">
        <span class="rotate-45">nwstats.info</span>
      </div>
    </div>

    <div class="join flex justify-center place-self-center rounded-none py-2">
      {#if pageSize > 5}
        <!-- Page 1 -->
        <button
          class="btn join-item btn-sm rounded-none"
          class:btn-active={currentPage === pageSizeArray[0]}
          on:pointerup={(e) => handleClickEvent(e)}>
          {pageSizeArray[0]}
        </button>
        <!-- Page 2 or currentPage - 1 -->
        {#if currentPage - 1 > 2 && currentPage - 1 <= pageSize - 3}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === currentPage - 1}
            on:pointerup={(e) => handleClickEvent(e)}>
            {currentPage - 1}
          </button>
        {:else if currentPage - 1 >= pageSize - 3}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === pageSize - 3}
            on:pointerup={(e) => handleClickEvent(e)}>
            {pageSize - 3}
          </button>
        {:else}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === pageSizeArray[1]}
            on:pointerup={(e) => handleClickEvent(e)}>
            {pageSizeArray[1]}
          </button>
        {/if}
        <!-- Page 3 or currentPage -->
        {#if currentPage > 3 && currentPage < pageSize - 1}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === currentPage}
            on:pointerup={(e) => handleClickEvent(e)}>
            {currentPage}
          </button>
        {:else if currentPage >= 1 && currentPage < 4}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === pageSizeArray[2]}
            on:pointerup={(e) => handleClickEvent(e)}>
            {pageSizeArray[2]}
          </button>
        {:else}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === pageSize - 2}
            on:pointerup={(e) => handleClickEvent(e)}>
            {pageSize - 2}
          </button>
        {/if}
        <!-- Page 4 or Page 5 or currentPage + 1 -->
        {#if currentPage + 1 < pageSize - 1 && currentPage + 1 > pageSizeArray[2]}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === currentPage + 1}
            on:pointerup={(e) => handleClickEvent(e)}>
            {currentPage + 1}
          </button>
        {:else if currentPage + 1 <= pageSizeArray[2]}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === pageSizeArray[3]}
            on:pointerup={(e) => handleClickEvent(e)}>
            {pageSizeArray[3]}
          </button>
        {:else}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === pageSize - 1}
            on:pointerup={(e) => handleClickEvent(e)}>
            {pageSize - 1}
          </button>
        {/if}
        <!-- Page 6 or last page -->
        <button
          class="btn join-item btn-sm rounded-none"
          class:btn-active={currentPage === pageSize}
          on:pointerup={(e) => handleClickEvent(e)}>
          {pageSize}
        </button>
      {:else}
        {#each pageSizeArray as i}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === i}
            on:pointerup={(e) => handleClickEvent(e)}>
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
