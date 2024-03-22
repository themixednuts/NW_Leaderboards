<script lang="ts">
  import { replaceLynshineSrc, appendPngToSrc } from '$lib/utils'
  import type { LeaderboardAPIBoardItem } from '$lib/leaderboard/utils'
  import type { LeaderboardData } from '$lib/leaderboard/types'

  type Props = {
    table: LeaderboardAPIBoardItem[]
    leaderboard: LeaderboardData
  }

  let { table, leaderboard }: Props = $props()

  let pageSize = $state(Math.ceil(table.length / 10))
  let pageSizeArray = $derived(Array.from({ length: pageSize }, (_, i) => i + 1))

  let currentPage = $state(1)
  let itemsPerPage = $state(10)

  let pageArrayIndex: (number | null)[] = $state([])

  const ranks = $derived(calculateRanks(table))

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

  $effect(() => {
    const arr = Array(itemsPerPage).fill(0)
    for (let i = 0; i < arr.length; i++) {
      arr[i] = i
    }
    pageArrayIndex = arr
  })

  function handleClickEvent(e: PointerEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    if (e.button !== 0) return // Only handle left click (0)
    currentPage = parseInt(e.currentTarget.innerText)
    displayPage(currentPage)
  }

  function displayPage(pageNumber: number) {
    const startIndex = (pageNumber - 1) * itemsPerPage
    // const endIndex = startIndex + itemsPerPage
    for (let i = 0; i < itemsPerPage; i++) {
      const index = startIndex + i
      if (index < table.length) {
        pageArrayIndex[i] = index
      } else {
        pageArrayIndex[i] = null
      }
    }
  }

  function secondsToTimeFormat(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  function getDateAndTime(date: string) {
    let dateObject: Date
    const unixTimeStampPattern = /^[0-9]+$/
    if (unixTimeStampPattern.test(date)) dateObject = new Date(+date * 1000)
    else dateObject = new Date(date)
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

<div class="grid min-w-fit grid-cols-1 grid-rows-[auto,1fr,auto] overflow-clip whitespace-nowrap contain-paint">
  {#if leaderboard}
    <div
      class="relative flex w-full min-w-fit place-items-center justify-center bg-base-300 py-4 text-sm uppercase sm:text-xl md:text-2xl xl:text-4xl"
    >
      {@html replaceLynshineSrc(leaderboard.Category)}
      - {!isNaN(Number(leaderboard.DisplayName))
        ? `${leaderboard.Category}, ${leaderboard.DisplayName}`
        : leaderboard.DisplayName}
      {#if leaderboard.CategoryAdditionalHeader}
        <div class="flex h-2/5 place-items-end gap-[2px] pl-2 text-sm">
          {@html appendPngToSrc(leaderboard.CategoryAdditionalHeader).replace('scale="2.0"', 'height="24" width="24"')}
        </div>
      {/if}
    </div>
    <div class="flex min-w-fit flex-col overflow-auto">
      <table
        class="table table-zebra table-pin-rows table-sm relative min-w-fit table-fixed select-none sm:table-md md:table-lg"
      >
        <thead class="">
          <tr>
            <th scope="col" class="w-24">Rank</th>
            <th scope="col">{leaderboard.ValueString}</th>
            <th scope="col" class="w-44">Server</th>
          </tr>
        </thead>
        <tbody>
          {#each pageArrayIndex as i}
            {#if i != null && table[i]}
              <tr>
                <td>{ranks[i]}</td>
                <td>
                  {leaderboard.ValueString === 'Time'
                    ? secondsToTimeFormat(table[i].value)
                    : table[i].value.toLocaleString()}
                </td>
                <td>{table[i].server}</td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
      <!-- <div class="absolute left-1/2 top-1/2 flex -translate-x-[25%] translate-y-[25%] select-none text-2xl opacity-20">
        <span class="rotate-45">nwstats.info</span>
      </div> -->
    </div>

    <div class="join flex min-w-fit justify-center place-self-center rounded-none py-2">
      {#if pageSize > 5}
        <!-- Page 1 -->
        <button
          class="btn join-item btn-sm rounded-none"
          class:btn-active={currentPage === pageSizeArray[0]}
          on:pointerup={(e) => handleClickEvent(e)}
        >
          {pageSizeArray[0]}
        </button>
        <!-- Page 2 or currentPage - 1 -->
        {#if currentPage - 1 > 2 && currentPage - 1 <= pageSize - 3}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === currentPage - 1}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {currentPage - 1}
          </button>
        {:else if currentPage - 1 >= pageSize - 3}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === pageSize - 3}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {pageSize - 3}
          </button>
        {:else}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === pageSizeArray[1]}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {pageSizeArray[1]}
          </button>
        {/if}
        <!-- Page 3 or currentPage -->
        {#if currentPage > 3 && currentPage < pageSize - 1}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === currentPage}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {currentPage}
          </button>
        {:else if currentPage >= 1 && currentPage < 4}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === pageSizeArray[2]}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {pageSizeArray[2]}
          </button>
        {:else}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === pageSize - 2}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {pageSize - 2}
          </button>
        {/if}
        <!-- Page 4 or Page 5 or currentPage + 1 -->
        {#if currentPage + 1 < pageSize - 1 && currentPage + 1 > pageSizeArray[2]}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === currentPage + 1}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {currentPage + 1}
          </button>
        {:else if currentPage + 1 <= pageSizeArray[2]}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === pageSizeArray[3]}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {pageSizeArray[3]}
          </button>
        {:else}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === pageSize - 1}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {pageSize - 1}
          </button>
        {/if}
        <!-- Page 6 or last page -->
        <button
          class="btn join-item btn-sm rounded-none"
          class:btn-active={currentPage === pageSize}
          on:pointerup={(e) => handleClickEvent(e)}
        >
          {pageSize}
        </button>
      {:else}
        {#each pageSizeArray as i}
          <button
            class="btn join-item btn-sm rounded-none"
            class:btn-active={currentPage === i}
            on:pointerup={(e) => handleClickEvent(e)}
          >
            {i}
          </button>
        {/each}
      {/if}
    </div>
  {:else}
    <div>No Table</div>
  {/if}
</div>
