<script lang="ts">
  import Dps from '$lib/components/charts/dps.svelte'
  import { Progress } from '$lib/shadcn/components/ui/progress'
  import * as Table from '$lib/shadcn/components/ui/table'
  import { onMount } from 'svelte'
  import { eventTypeHelpers, getEventsByTypePerCharacter, type MappedData } from '../utils.svelte.js'
  import { page } from '$app/stores'
  import EventsView from '$lib/components/views/events.svelte'
  import { mount, unmount } from 'svelte'
  import type { Action } from 'svelte/action'
  import Tabletooltip from '$lib/components/tabletooltip.svelte'

  let { data } = $props()

  function damageTableTooltip(row: MappedData, totalDamage: number) {
    return {
      headers: [
        { text: 'Type', class: 'w-28' },
        { text: 'Damage', class: '' },
        { text: 'Crit %', class: 'w-16' },
      ],
      rows: [
        {
          cells: [
            { text: 'Melee' },
            {
              text: Math.round(row.meleeDamage),
              total: totalDamage,
              class: 'relative grid min-w-56 grid-cols-[3rem,1fr] items-center gap-3',
            },
            { text: (row.meleePercent ?? 0 * 100).toFixed(2) },
          ],
        },
        {
          cells: [
            { text: 'Range' },
            {
              text: Math.round(row.rangeDamage),
              total: totalDamage,
              class: 'relative grid min-w-56 grid-cols-[3rem,1fr] items-center gap-3',
            },
            { text: (row.rangePercent ?? 0 * 100).toFixed(2) },
          ],
        },
        {
          cells: [
            { text: 'Status Effect' },
            {
              text: Math.round(row.IsFromStatusEffect),
              total: totalDamage,
              class: 'relative grid min-w-56 grid-cols-[3rem,1fr] items-center gap-3',
            },
            { text: (row.statusEffectPercent ?? 0 * 100).toFixed(2) },
          ],
        },
      ].sort((a, b) => +b.cells[1].text - +a.cells[1].text),
    }
  }
  let type = $state($page.url.searchParams.get('type')) as keyof typeof eventTypeHelpers
  let start = $state($page.url.searchParams.get('start'))
  let end = $state($page.url.searchParams.get('end'))
  let report: Awaited<typeof data.report> | undefined = $state()

  let damageEventsByType = $derived.by(() => {
    if (type === 'damagedone' || type === 'damagetaken')
      return getEventsByTypePerCharacter(report, type, start, end).sort((a, b) => b.damage - a.damage)
    else if (type === 'healingdone') return getEventsByTypePerCharacter(report, type, start, end)
  })

  let total = $derived.by(() => {
    if (damageEventsByType && !('amount' in damageEventsByType))
      return damageEventsByType.reduce((acc, curr) => curr.damage + acc, 0)
    else if (damageEventsByType) return damageEventsByType.amount
  })
  $effect(() => {
    type = $page.url.searchParams.get('type') as keyof typeof eventTypeHelpers
    start = $page.url.searchParams.get('start')
    end = $page.url.searchParams.get('end')
  })

  const action: Action<HTMLDivElement, {}> = (el, appState) => {
    // let tableTooltipElement = document.createElement('div')
    // let app = mount(Tabletooltip, { target: tableTooltipElement, props: appState })
    // const instance = tippy(el, {
    // 	followCursor: true,
    // 	plugins: [followCursor],
    // 	offset: [20, 30],
    // 	allowHTML: true,
    // 	placement: 'bottom-start',
    // 	maxWidth: 'none',
    // 	delay: [0, 0],
    // 	animation: 'fade',
    // 	content: tableTooltipElement.innerHTML,
    // })
    // function hideSingleton() {
    // 	instance.unmount()
    // }
    // el.addEventListener('mouseleave', hideSingleton)
    // return {
    // 	destroy: () => {
    // 		unmount(app)
    // 		instance.destroy()
    // 		el.removeEventListener('mouseleave', hideSingleton)
    // 	},
    // 	update: (props) => {
    // 		unmount(app)
    // 		tableTooltipElement.innerHTML = ''
    // 		app = mount(Tabletooltip, { target: tableTooltipElement, props: props })
    // 		instance.setContent(tableTooltipElement.innerHTML)
    // 	},
    // }
  }

  onMount(async () => {
    report = await data.report
  })
</script>

{#if report}
  <Dps data={report.log.data} />

  {#if !$page.url.searchParams.get('view')}
    <Table.Root class="table-auto caption-top">
      <Table.Caption>Damage Types</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-44">Type</Table.Head>
          <Table.Head>Damage</Table.Head>
          <Table.Head>Crit %</Table.Head>
          <Table.Head>Hits</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#if damageEventsByType && 'length' in damageEventsByType && total}
          {#each damageEventsByType as row, i}
            {@const ratio = (row.damage / total) * 100}
            <!-- {@const dmgPerTarget = getTargetsByDamageType(log[0].log.data, row.dmgType)} -->
            <Table.Row>
              <Table.Cell class="font-medium">{row.dmgType}</Table.Cell>
              <Table.Cell>
                <div
                  class="relative grid min-w-56 grid-cols-[3rem,1fr] items-center gap-3"
                  use:action={damageTableTooltip(row, total)}
                >
                  {ratio.toFixed(2)}%
                  <Progress value={ratio} class="h-8 rounded-none" />
                  <div class="absolute right-4 mix-blend-difference">
                    {Math.floor(row.damage)}
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>{((row.critPercent ?? 0) * 100).toFixed(2)}%</Table.Cell>
              <Table.Cell>{row.hits}</Table.Cell>
            </Table.Row>
          {/each}
        {/if}
      </Table.Body>
    </Table.Root>
  {:else if $page.url.searchParams.get('view') === 'events'}
    <EventsView reports={report.log.data.filter((event) => event.subtype !== 'initialize')} />
  {/if}
{/if}
