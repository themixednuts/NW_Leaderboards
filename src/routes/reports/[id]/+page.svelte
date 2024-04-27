<script lang="ts">
  import { onMount } from 'svelte'
  import Breakdown from '$lib/components/views/table.svelte'
  import { page } from '$app/stores'
  import EventsView from '$lib/components/views/events.svelte'
  import * as Table from '$lib/shadcn/components/ui/table'
  import Chart, { type ChartCallbacks } from '@/components/chart/chart.svelte'
  import { filterByType, generateDataset, type ChartContext } from '@/components/chart/utils.svelte.js'
  import { goto } from '$app/navigation'
  import type { LogEvent, StatusEffectActiveEvent, StatusEffectStackEvent } from '@/events.types.js'

  type StatusUptimes = Record<string, Map<string, number>>
  type Tuple<T, N extends number, A extends any[] = []> = A extends { length: N } ? A : Tuple<T, N, [...A, T]>
  type MyTuple = Tuple<StatusEffectActiveEvent, 8>

  let { data } = $props()

  let reports: Awaited<typeof data.reports> | undefined = $state()
  let flattened = $derived(reports?.flatMap((event) => event.data).sort((a, b) => a.eventAt - b.eventAt))

  let statusUptimes = $derived.by(() => {
    const state: Record<string, MyTuple> = {}

    if (!flattened) return
    return Object.entries(
      flattened?.reduce((acc, ev, idx, arr) => {
        if (ev.type === 'statuseffect') {
          if (!acc[ev.data.playerName]) {
            acc[ev.data.playerName] = new Map()
            state[ev.data.playerName] = new Array<MyTuple>(8).map((ele) => ({}) as StatusEffectActiveEvent) as MyTuple
          }
          const char = acc[ev.data.playerName]

          if (ev.subtype === 'active') {
            // console.log(ev.data.idx, 'active')
            if (!char.has(ev.data.name)) {
              char.set(ev.data.name, 0)
            }
            state[ev.data.playerName][ev.data.idx - 1] = ev
          }

          if (ev.subtype === 'inactive') {
            // console.log(ev.data.idx, 'inactive')
            const _event = state[ev.data.playerName][ev.data.idx - 1]
            let v = char.get(_event.data.name)
            if (v != undefined) {
              v += ev.eventAt - state[ev.data.playerName][ev.data.idx - 1].eventAt
              char.set(_event.data.name, v)
            }
          }
        }
        return acc
      }, {} as StatusUptimes),
    )
  })

  $inspect(statusUptimes)

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
      {#each statusUptimes as [playerName, uptimes]}
        {playerName}
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
