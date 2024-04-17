<script lang="ts">
  import DPS from '$lib/components/charts/dps.svelte'
  import { onMount } from 'svelte'
  import Breakdown from '$lib/components/views/table.svelte'
  // import * as Table from '$lib/shadcn/components/ui/table'
  import { page } from '$app/stores'
  import EventsView from '$lib/components/views/events.svelte'
  import type { LogEvent } from '@/events.types.js'
  import * as Table from '$lib/shadcn/components/ui/table'

  type StatusUptimes = {
    [k: string]: Map<string, number>
  }

  let { data } = $props()

  let reports: Awaited<typeof data.reports> | undefined = $state()
  let flattened = $derived(reports?.flatMap((event) => event.data).sort((a, b) => a.eventAt - b.eventAt))
  $inspect(flattened)

  let statusUptimes = $derived.by(() => {
    const state = {}

    if (!flattened) return
    return Object.entries(
      flattened?.reduce((acc, ev, idx, arr) => {
        if (ev.type === 'statuseffect') {
          if (!acc[ev.data.characterId]) {
            acc[ev.data.characterId] = new Map()
          }
          const char = acc[ev.data.characterId]
          if (!char.has(ev.data.id)) {
            char.set(ev.data.id, 0)
          }

          if (ev.subtype === 'active') {
            //@ts-expect-error
            state[ev.data.characterId] ??= {}
            //@ts-expect-error
            state[ev.data.characterId][ev.data.id] = ev.eventAt
          }

          if (ev.subtype === 'inactive') {
            let v = char.get(ev.data.id)
            //@ts-expect-error
            v += ev.eventAt - state[ev.data.characterId][ev.data.id]
            //@ts-expect-error
            char.set(ev.data.id, v)
          }
        }
        return acc
      }, {} as StatusUptimes),
    )
  })

  $inspect(statusUptimes)
  onMount(async () => {
    reports = await data.reports
  })
</script>

{#if reports && flattened?.length}
  <DPS data={flattened} />
  {#if !$page.url.searchParams.get('view')}
    <div class="grid grid-cols-[repeat(2,minmax(auto,1fr))] gap-2">
      <Breakdown {reports} data={flattened} type="damagedone" />
      <Breakdown {reports} data={flattened} type="damagetaken" />
      <Breakdown {reports} data={flattened} type="healingdone" />
      <Breakdown {reports} data={flattened} type="deaths" />
    </div>
    {#each statusUptimes as [charId, uptimes]}
      {#await data.characters then characters}
        {characters.find((character) => character.id === charId)?.name}
      {/await}
      <div class="h-96 overflow-y-auto">
        <Table.Root>
          <Table.Header class="">
            <Table.Row class="table-row table-fixed">
              <Table.Head>ID</Table.Head>
              <Table.Head>Uptime</Table.Head>
              <Table.Head class="text-right">%</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body class="">
            {#each uptimes as [id, uptime]}
              <Table.Row>
                <Table.Cell>
                  {id.replaceAll('_', ' ')}
                </Table.Cell>
                <Table.Cell>
                  {uptime > 0 ? uptime.toFixed(2) : '---'}
                </Table.Cell>
                <Table.Cell class="text-right">
                  {@const up = (uptime / (flattened[flattened.length - 1].eventAt - flattened[0].eventAt)) * 100}
                  {up > 0 ? up.toFixed(2) + '%' : '---'}
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </div>
    {/each}
  {:else if $page.url.searchParams.get('view') === 'events'}
    <EventsView reports={flattened} />
  {/if}
{/if}
