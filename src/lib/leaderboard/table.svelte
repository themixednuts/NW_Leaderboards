<script lang="ts">
  import { replaceLynshineSrc, appendPngToSrc, FACTIONS, debounce, secondsToTimeFormat } from '$lib/utils'
  import type { LeaderboardData } from '$lib/leaderboard/types'
  import Players from './players.svelte'
  import { page } from '$app/stores'
  import * as Table from '@/shadcn/components/ui/table'
  import { Button } from '@/shadcn/components/ui/button'
  import { ScrollArea } from '@/shadcn/components/ui/scroll-area'
  import { FunnelSimple, Question, SortAscending, SortDescending } from 'phosphor-svelte'
  import * as Tooltip from '@/shadcn/components/ui/tooltip'
  import { cn } from '@/shadcn/utils'
  import { Input } from '@/shadcn/components/ui/input'
  import type { PageData } from '../../routes/lb/[first]/[category]/[second]/[rotation]/[type]/[season]/[page]/$types'
  import { goto } from '$app/navigation'
  import { CircleNotch } from 'phosphor-svelte'
  import { Skeleton } from '@/shadcn/components/ui/skeleton'

  type Props = {
    json: PageData['json']
    leaderboard: LeaderboardData
  }

  let { json, leaderboard }: Props = $props()

  interface Headers {
    label: string
    sort?: string | null
  }
  let type = $derived($page.params.type)
  const headers: Headers[] = $derived([
    {
      label: 'rank',
      // sort: $page.url.searchParams.get('sort') === 'rank' ? 'asc' : 'desc',
    },
    {
      label: type,
      // sort: $page.url.searchParams.get('sort') === 'faction' ? 'asc' : 'desc',
    },
    {
      label: leaderboard.ValueString,
      // sort: $page.url.searchParams.get('sort') === 'rank' ? 'asc' : 'desc',
    },
    {
      label: 'server',
      // sort: $page.url.searchParams.get('sort') === 'rank' ? 'asc' : 'desc',
    },
  ])

  let url = $derived(new URL($page.url))
  let total = $state(0)

  async function updateTotal() {
    const d = await json
    total = d.total
  }
  $effect(() => {
    updateTotal()
  })

  let value = $state($page.url.searchParams.get('search') ?? '')
  let input: HTMLInputElement | undefined = $state()
</script>

<div class="grid min-w-fit grid-cols-1 grid-rows-[min-content,min-content,1fr] overflow-y-auto contain-paint">
  {#if leaderboard}
    <div class="flex items-start self-start">
      <div
        class="relative flex w-full min-w-fit flex-col place-content-start place-items-start whitespace-nowrap py-4 pl-4 text-sm uppercase sm:text-xl md:text-2xl xl:text-4xl"
      >
        <div class="flex *:aspect-square *:h-min">
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
      <div class="flex select-none items-center justify-end space-x-4 p-4">
        <Button
          href={$page.url.pathname.replace(/\/([^\/]+)\/?$/, `/${String(Number($page.params.page) - 1)}`) +
            $page.url.search}
          variant="outline"
          size="sm"
          class={cn('', {
            'pointer-events-none opacity-60': Number($page.params.page) <= 1,
          })}
        >
          Previous
        </Button>
        <div class="flex min-w-14 whitespace-nowrap text-right text-sm">
          {$page.params.page} / {total}
        </div>
        {#key total}
          <Button
            variant="outline"
            size="sm"
            href={$page.url.pathname.replace(/\/([^\/]+)\/?$/, `/${String(Number($page.params.page) + 1)}`) +
              $page.url.search}
            class={cn('', {
              'pointer-events-none opacity-60': Number($page.params.page) >= total,
            })}
          >
            Next
          </Button>
        {/key}
      </div>
    </div>
    <!-- <form class="flex-1 sm:flex-initial" method="post" action="/?/search" use:enhance={handleSubmit} bind:this={formEl}> -->
    <div class="flex items-center pb-2 pl-2">
      <Input
        class="max-w-sm rounded-xl"
        placeholder="Filter characters..."
        type="search"
        bind:value
        name="q"
        onchange={(e) => {
          e.preventDefault()
          const url = new URL($page.url)
          if (e.currentTarget.value.length) url.searchParams.set('search', e.currentTarget.value)
          else url.searchParams.delete('search')
          return goto(url, {
            keepFocus: true,
            noScroll: true,
            invalidateAll: true,
          })
        }}
        oninput={(e) => {
          e.preventDefault()
          if (!e.currentTarget.value.length) {
            const url = new URL($page.url)
            url.searchParams.delete('search')
            return goto(url, {
              keepFocus: true,
              noScroll: true,
              invalidateAll: true,
            })
          }
        }}
        bind:el={input}
      />
    </div>
    <!-- </form> -->
    <ScrollArea class="relative flex min-w-fit flex-col overflow-auto">
      <Table.Root>
        <Table.Caption>Public Members</Table.Caption>
        <Table.Header>
          <Table.Row>
            {#each headers as header, i}
              {@const sort = url.searchParams.get('sort')}
              {@const lbl = i === 2 ? 'value' : header.label.toLowerCase()}
              <Table.Head
                class={cn('capitalize', {
                  'w-6': header.label === 'rank',
                  'w-10': header.label !== 'rank',
                  'w-full': i === 1,
                })}
              >
                <div class="flex size-full items-center gap-2">
                  {#if header.label !== 'character' && header.label !== 'company'}
                    <Button
                      variant="ghost"
                      size="icon"
                      class="size-full max-w-fit gap-2 px-4 capitalize"
                      onclick={() => {
                        if (sort === `${lbl}_desc`) url.searchParams.delete('sort')
                        else if (!sort || sort !== lbl) url.searchParams.set('sort', lbl)
                        else url.searchParams.set('sort', `${lbl}_desc`)
                        goto(url)
                      }}
                    >
                      {header.label}
                      {#if sort === `${lbl}_desc`}
                        <SortDescending class={'pointer-events-none size-4'} />
                      {:else if sort === `${lbl}`}
                        <SortAscending class={'pointer-events-none size-4'} />
                      {:else}
                        <FunnelSimple class={'pointer-events-none size-4'} />
                      {/if}
                    </Button>
                  {:else}
                    {header.label}
                  {/if}
                </div>
              </Table.Head>
            {/each}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#await json}
            {#each { length: 10 } as _}
              <Table.Row class="h-[3.5625rem]">
                <Table.Cell>
                  <Skeleton class="h-4 w-6 rounded-full" />
                </Table.Cell>
                <Table.Cell>
                  {#if leaderboard.FirstLevelCategory === 'Mutated Expeditions'}
                    <div class={cn('grid grid-cols-[repeat(2,minmax(min-content,1fr))] gap-1', {})}>
                      {#each { length: 5 } as _}
                        <div class="flex place-items-center gap-2">
                          <Skeleton class="size-6 rounded-full" />
                          <Skeleton class="h-4 w-10 rounded-full" />
                        </div>
                      {/each}
                    </div>
                  {:else}
                    <div class="flex place-items-center gap-2">
                      <Skeleton class="size-6 rounded-full" />
                      <Skeleton class="h-4 w-10 rounded-full" />
                    </div>
                  {/if}
                </Table.Cell>
                <Table.Cell>
                  <Skeleton class="h-4 w-6 rounded-full" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton class="h-4 w-6 rounded-full" />
                </Table.Cell>
              </Table.Row>
            {/each}
          {:then { data }}
            {#if data}
              {#each data as { rank, entityId, faction, server, value }, _}
                <Table.Row>
                  <Table.Cell>
                    {rank}
                  </Table.Cell>
                  <Table.Cell>
                    {#if entityId && typeof entityId !== 'string'}
                      <Players players={entityId} />
                    {:else if faction}
                      {FACTIONS[faction.replace('Faction', '') as unknown as keyof typeof FACTIONS]}
                    {/if}
                  </Table.Cell>
                  <Table.Cell>
                    {leaderboard.ValueString === 'Time' ? secondsToTimeFormat(value) : value}
                  </Table.Cell>
                  <Table.Cell>
                    {server}
                  </Table.Cell>
                </Table.Row>
              {/each}
            {:else}
              <h1 class="place-self-center text-3xl">No Data</h1>
            {/if}
          {/await}
        </Table.Body>
        <Table.Footer class="w-full whitespace-nowrap bg-transparent"></Table.Footer>
      </Table.Root>
    </ScrollArea>
  {:else}
    <div>No Table</div>
  {/if}
</div>
