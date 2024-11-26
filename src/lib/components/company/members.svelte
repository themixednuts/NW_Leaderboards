<script lang="ts">
  import type { getCompanyWithMembersByName } from '@/server/db/gamedata/helpers'
  import * as Table from '@/shadcn/components/ui/table'
  import { normalize_name } from '@/utils'
  import { SvelteDate } from 'svelte/reactivity'
  import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table'
  import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins'
  import { readable } from 'svelte/store'
  import { Button } from '@/shadcn/components/ui/button'
  import { Input } from '@/shadcn/components/ui/input'
  import { FunnelSimple, SortAscending, SortDescending } from 'phosphor-svelte'
  import Icon from '../player/icon.svelte'
  import Actions from './actions.svelte'
  import { cn } from '@/shadcn/utils'
  interface Props {
    guild: NonNullable<Awaited<ReturnType<typeof getCompanyWithMembersByName>>>
  }

  let { guild }: Props = $props()

  const table = createTable(readable(guild.characters), {
    page: addPagination(),
    sort: addSortBy(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase()),
    }),
  })

  const columns = table.createColumns([
    table.column({
      accessor: 'name',
      header: 'Name',
    }),
    table.column({
      accessor: 'guildRank',
      header: 'Rank',
      plugins: {
        filter: {
          exclude: true,
        },
      },
    }),
    table.column({
      accessor: 'level',
      header: 'Level',
      plugins: {
        filter: {
          exclude: true,
        },
      },
    }),
    table.column({
      accessor: (character) => character,
      header: '',
      cell: ({ value }) =>
        createRender(Actions, {
          character: value,
          userRank: guild.characters.find((character) => character.isUsersCharacter)?.guildRank,
        }),
      plugins: {
        filter: {
          exclude: true,
        },
        sort: {
          disable: true,
        },
      },
    }),
  ])

  let updatedAt = new SvelteDate(guild.updatedAt)

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns)
  const { hasNextPage, hasPreviousPage, pageIndex, pageCount } = pluginStates.page
  const { sortKeys } = pluginStates.sort
  const { filterValue } = pluginStates.filter
</script>

<div class="flex w-full items-center gap-2 py-4">
  <Input class="max-w-sm rounded-xl" placeholder="Filter characters..." type="text" bind:value={$filterValue} />
  <div class="flex grow select-none items-center justify-end space-x-4 py-4">
    <Button variant="outline" size="sm" on:click={() => ($pageIndex = $pageIndex - 1)} disabled={!$hasPreviousPage}>
      Previous
    </Button>
    <div class="whitespace-nowrap text-sm">
      {$pageIndex + 1} / {$pageCount}
    </div>
    <Button variant="outline" size="sm" disabled={!$hasNextPage} on:click={() => ($pageIndex = $pageIndex + 1)}>
      Next
    </Button>
  </div>
</div>
<Table.Root {...$tableAttrs}>
  <Table.Caption>Public Members</Table.Caption>
  <Table.Header>
    {#each $headerRows as headerRow}
      <Subscribe rowAttrs={headerRow.attrs()}>
        <Table.Row>
          {#each headerRow.cells as cell, i (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
              <Table.Head
                {...attrs}
                class={cn('', {
                  'w-8': headerRow.cells.length - 1 === i,
                  'w-64': cell.id === 'name',
                })}
              >
                {#if !props.sort.disabled}
                  <Button variant="ghost" on:click={props.sort.toggle}>
                    <Render of={cell.render()} />
                    {#if $sortKeys.some((key) => key.id === cell.id && key.order === 'desc')}
                      <SortDescending class={'ml-2 h-4 w-4'} />
                    {:else if $sortKeys.some((key) => key.id === cell.id && key.order === 'asc')}
                      <SortAscending class={'ml-2 h-4 w-4'} />
                    {:else}
                      <FunnelSimple class={'ml-2 h-4 w-4'} />
                    {/if}
                  </Button>
                {/if}
              </Table.Head>
            </Subscribe>
          {/each}
        </Table.Row>
      </Subscribe>
    {/each}
  </Table.Header>
  <Table.Body {...$tableBodyAttrs}>
    {#each $pageRows as row (row.id)}
      <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
        <Table.Row {...rowAttrs}>
          {#each row.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <Table.Cell {...attrs} class="capitalize">
                {#if cell.id === 'name' && cell.isData()}
                  <a href="/character/{normalize_name(cell.value as string)}">
                    <div class="flex items-center gap-2">
                      <div class="size-6">
                        {#if row.isData()}
                          <Icon character={row.original} />
                        {/if}
                      </div>
                      <Render of={cell.render()} />
                    </div>
                  </a>
                {:else}
                  <Render of={cell.render()} />
                {/if}
              </Table.Cell>
            </Subscribe>
          {/each}
        </Table.Row>
      </Subscribe>
    {/each}
  </Table.Body>
  <Table.Footer class="w-full whitespace-nowrap bg-transparent">
    Updated: {updatedAt.toDateString()}
  </Table.Footer>
</Table.Root>
