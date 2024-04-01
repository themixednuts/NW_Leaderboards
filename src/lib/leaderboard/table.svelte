<script lang="ts">
  import { replaceLynshineSrc, appendPngToSrc } from '$lib/utils'
  import type { LeaderboardAPIBoardItem } from '$lib/leaderboard/utils'
  import type { LeaderboardData } from '$lib/leaderboard/types'
  import Player from './player.svelte'
  import { page } from '$app/stores'
  import * as Table from '@/shadcn/components/ui/table'
  import { Button } from '@/shadcn/components/ui/button'
  import { ScrollArea } from '@/shadcn/components/ui/scroll-area'
  import { Question } from 'phosphor-svelte'
  import * as Tooltip from '@/shadcn/components/ui/tooltip'
  import { cn } from '@/shadcn/utils'

  type Props = {
    table: LeaderboardAPIBoardItem[]
    leaderboard: LeaderboardData
  }

  let { table, leaderboard }: Props = $props()

  let type = $derived($page.params.type)

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

  function handleClickEvent(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
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

  const factions = {
    1: 'Syndacite',
    2: 'Marauders',
    3: 'Covenant',
  }
</script>

<div class="grid min-w-fit grid-cols-1 grid-rows-[auto,1fr,auto] overflow-y-auto contain-paint">
  {#if leaderboard}
    <div
      class="relative flex w-full min-w-fit flex-col place-content-center place-items-start whitespace-nowrap py-4 pl-2 text-sm uppercase sm:text-xl md:text-2xl xl:text-4xl"
    >
      <div>
        {@html replaceLynshineSrc(leaderboard.Category)}, {leaderboard.DisplayName}
      </div>
      <div class="flex place-content-center place-items-center text-sm">
        {leaderboard.SecondLevelCategory}
        {#if leaderboard.CategoryDescription}
          <Tooltip.Root openDelay={0} disableHoverableContent={true}>
            <Tooltip.Trigger>
              <Question class="ml-1" />
            </Tooltip.Trigger>
            <Tooltip.Content class="flex place-content-center place-items-center gap-2">
              {@html appendPngToSrc(leaderboard.CategoryDescription)}
            </Tooltip.Content>
          </Tooltip.Root>
        {/if}
        {#if leaderboard.CategoryAdditionalHeader}
          <div class="flex place-content-center place-items-center gap-1 pl-2 text-sm">
            {@html appendPngToSrc(leaderboard.CategoryAdditionalHeader)
              .replace(/\{(COLOR)\}/i, 'gold')
              .replace('scale="2.0"', 'class="size-6 text-yellow-500"')}
          </div>
        {/if}
      </div>
    </div>
    <ScrollArea class="relative flex min-w-fit flex-col overflow-auto">
      <Table.Root class="relative">
        <Table.Header class="sticky top-0">
          <Table.Row class="">
            <Table.Head class="w-16">Rank</Table.Head>
            <Table.Head class="capitalize">{type}</Table.Head>
            <Table.Head class="w-20">{leaderboard.ValueString}</Table.Head>
            <Table.Head class="w-24">Server</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each pageArrayIndex as i}
            {#if i != null && table[i]}
              {@const players = table[i].entityId?.split('_')}
              <Table.Row>
                <Table.Cell>{ranks[i]}</Table.Cell>
                <Table.Cell class={cn('grid grid-cols-1 gap-1', { 'grid-cols-2': (players?.length || 0) > 1 })}>
                  {#if players}
                    {#each players as player}
                      <Player id={player} type={type === 'character' ? 'character' : 'guild'} />
                    {/each}
                  {:else}
                    {factions[table[1].faction?.replace('Faction', '') as unknown as keyof typeof factions]}
                  {/if}
                </Table.Cell>
                <Table.Cell>
                  {leaderboard.ValueString === 'Time'
                    ? secondsToTimeFormat(table[i].value)
                    : table[i].value.toLocaleString()}
                </Table.Cell>
                <Table.Cell>{table[i].server}</Table.Cell>
              </Table.Row>
            {/if}
          {/each}
        </Table.Body>
      </Table.Root>
    </ScrollArea>

    <div class="join flex min-w-fit justify-center place-self-center rounded-none py-2">
      {#if pageSize > 5}
        <!-- Page 1 -->
        <!-- class:active={currentPage === pageSizeArray[0]} -->
        <Button
          class="join-item rounded-none"
          onclick={(e: Parameters<typeof handleClickEvent>[0]) => handleClickEvent(e)}
        >
          {pageSizeArray[0]}
        </Button>
        <!-- Page 2 or currentPage - 1 -->
        {#if currentPage - 1 > 2 && currentPage - 1 <= pageSize - 3}
          <!-- class:active={currentPage === currentPage - 1} -->
          <Button
            class="join-item rounded-none"
            onclick={(e: Parameters<typeof handleClickEvent>[0]) => handleClickEvent(e)}
          >
            {currentPage - 1}
          </Button>
        {:else if currentPage - 1 >= pageSize - 3}
          <!-- class:active={currentPage === pageSize - 3} -->
          <Button
            class="join-item rounded-none"
            onclick={(e: Parameters<typeof handleClickEvent>[0]) => handleClickEvent(e)}
          >
            {pageSize - 3}
          </Button>
        {:else}
          <!-- class:active={currentPage === pageSizeArray[1]} -->
          <Button
            class="join-item rounded-none"
            onclick={(e: Parameters<typeof handleClickEvent>[0]) => handleClickEvent(e)}
          >
            {pageSizeArray[1]}
          </Button>
        {/if}
        <!-- Page 3 or currentPage -->
        {#if currentPage > 3 && currentPage < pageSize - 1}
          <!-- class:active={currentPage === currentPage} -->
          <Button
            class="join-item rounded-none"
            onclick={(e: Parameters<typeof handleClickEvent>[0]) => handleClickEvent(e)}
          >
            {currentPage}
          </Button>
        {:else if currentPage >= 1 && currentPage < 4}
          <!-- class:active={currentPage === pageSizeArray[2]} -->
          <Button
            class="join-item rounded-none"
            onclick={(e: Parameters<typeof handleClickEvent>[0]) => handleClickEvent(e)}
          >
            {pageSizeArray[2]}
          </Button>
        {:else}
          <!-- class:active={currentPage === pageSize - 2} -->
          <Button
            class="join-item rounded-none"
            onclick={(e: Parameters<typeof handleClickEvent>[0]) => handleClickEvent(e)}
          >
            {pageSize - 2}
          </Button>
        {/if}
        <!-- Page 4 or Page 5 or currentPage + 1 -->
        {#if currentPage + 1 < pageSize - 1 && currentPage + 1 > pageSizeArray[2]}
          <!-- class:active={currentPage === currentPage + 1} -->
          <Button
            class="join-item rounded-none"
            onclick={(e: Parameters<typeof handleClickEvent>[0]) => handleClickEvent(e)}
          >
            {currentPage + 1}
          </Button>
        {:else if currentPage + 1 <= pageSizeArray[2]}
          <!-- class:active={currentPage === pageSizeArray[3]} -->
          <Button
            class="join-item rounded-none"
            onclick={(e: Parameters<typeof handleClickEvent>[0]) => handleClickEvent(e)}
          >
            {pageSizeArray[3]}
          </Button>
        {:else}
          <!-- class:active={currentPage === pageSize - 1} -->
          <Button
            class="join-item rounded-none"
            onclick={(e: Parameters<typeof handleClickEvent>[0]) => handleClickEvent(e)}
          >
            {pageSize - 1}
          </Button>
        {/if}
        <!-- Page 6 or last page -->
        <!-- class:active={currentPage === pageSize} -->
        <Button
          class="join-item rounded-none"
          onclick={(e: Parameters<typeof handleClickEvent>[0]) => handleClickEvent(e)}
        >
          {pageSize}
        </Button>
      {:else}
        {#each pageSizeArray as i}
          <!-- class:active={currentPage === i}  -->
          <Button
            class="join-item rounded-none"
            onclick={(e: Parameters<typeof handleClickEvent>[0]) => handleClickEvent(e)}
          >
            {i}
          </Button>
        {/each}
      {/if}
    </div>
  {:else}
    <div>No Table</div>
  {/if}
</div>
