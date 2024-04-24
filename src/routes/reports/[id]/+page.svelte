<script lang="ts">
  import { onMount } from 'svelte'
  import Breakdown from '$lib/components/views/table.svelte'
  import { page } from '$app/stores'
  import EventsView from '$lib/components/views/events.svelte'
  import * as Table from '$lib/shadcn/components/ui/table'
  import Chart, { type ChartCallbacks } from '@/components/chart/chart.svelte'
  import { filterByType, generateDataset, type ChartContext } from '@/components/chart/utils.svelte.js'
  import { goto } from '$app/navigation'

  type StatusUptimes = Record<string, Map<string, number>>

  let { data } = $props()

  let reports: Awaited<typeof data.reports> | undefined = $state()
  let flattened = $derived(reports?.flatMap((event) => event.data).sort((a, b) => a.eventAt - b.eventAt))

  let statusUptimes = $derived.by(() => {
    const state: Record<string, Record<string, number>> = {}

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
            state[ev.data.characterId] ??= {}
            state[ev.data.characterId][ev.data.id] = ev.eventAt
          }

          if (ev.subtype === 'inactive') {
            let v = char.get(ev.data.id)
            if (v) {
              v += ev.eventAt - state[ev.data.characterId][ev.data.id]
              char.set(ev.data.id, v)
            }
          }
        }
        return acc
      }, {} as StatusUptimes),
    )
  })

  let start = $derived(Number($page.url.searchParams.get('start')))
  let end = $derived(Number($page.url.searchParams.get('end')))

  let datasets = $derived.by(() => {
    if (flattened)
      return [
        generateDataset(flattened, 'Damage Done', 'damage', 'outgoing', '75,150,195', 'circle', start, end),
        generateDataset(flattened, 'Damage Taken', 'damage', 'incoming', '195,75,75', 'square', start, end),
        generateDataset(flattened, 'Healing Done', 'healing', 'outgoing', '75,195,75', 'triangle', start, end),
      ].filter(filterByType)
    return []
  })

  const builders: ChartCallbacks = {
    onZoomComplete: (ctx) => {
      const url = new URL($page.url)
      url.searchParams.set('start', ctx.chart.scales.x.min.toString())
      url.searchParams.set('end', ctx.chart.scales.x.max.toString())
      goto(url)
    },
    onPanComplete: (ctx) => {
      const url = new URL($page.url)
      url.searchParams.set('start', ctx.chart.scales.x.min.toString())
      url.searchParams.set('end', ctx.chart.scales.x.max.toString())
      goto(url)
    },
    onZoomReset: (ctx) => {
      const url = new URL($page.url)
      url.searchParams.delete('start')
      url.searchParams.delete('end')
      goto(url)
    },
    tick: (tickValue, index, ticks) => {
      if (!flattened || !flattened.length) return tickValue
      const elapsedMilliseconds = ticks[index].value - flattened[0].eventAt
      const minutes = Math.floor(elapsedMilliseconds / (60 * 1000))
      const seconds = Math.floor((elapsedMilliseconds % (60 * 1000)) / 1000)
      const milliseconds = Math.floor(elapsedMilliseconds % 1000)

      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`
    },
  }

  onMount(async () => {
    reports = await data.reports
  })
</script>

{#if reports && flattened?.length}
  <Chart {datasets} {...builders} {start} {end} />
  {#if !$page.url.searchParams.get('view')}
    <div class="grid grid-cols-[repeat(2,minmax(auto,1fr))] gap-2">
      <Breakdown {reports} data={flattened} type="damagedone" />
      <Breakdown {reports} data={flattened} type="damagetaken" />
      <Breakdown {reports} data={flattened} type="healingdone" />
      <Breakdown {reports} data={flattened} type="deaths" />
    </div>
    {#if statusUptimes}
      {#each statusUptimes as [charId, uptimes]}
        <!-- {#await data.characters then characters}
          {characters.find((character) => character.id === charId)?.name}
        {/await} -->
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
    {/if}
  {:else if $page.url.searchParams.get('view') === 'events'}
    <EventsView reports={flattened} />
  {/if}
{/if}
