<script lang="ts">
  import { page } from '$app/stores'
  import { Progress } from '$lib/shadcn/components/ui/progress'
  import * as Table from '$lib/shadcn/components/ui/table'
  import {
    tooltipData,
    resolvePath,
    type AwaitedReportLogs,
    getEventsByTypePerCharacter,
    eventTypeHelpers,
  } from '../../../routes/reports/[id]/utils.svelte'
  import Tabletooltip from '$lib/components/tabletooltip.svelte'
  import type { LogEvent } from '@/events.types'
  import * as Tooltip from '@/shadcn/components/ui/tooltip'

  type Props = {
    reports: AwaitedReportLogs
    data: LogEvent[]
    type: keyof typeof eventTypeHelpers
  }

  let { reports, data, type }: Props = $props()

  let start = $derived($page.url.searchParams.get('start'))
  let end = $derived($page.url.searchParams.get('end'))

  let eventsByCharacter = $derived(
    getEventsByTypePerCharacter(reports, type, start, end)?.sort((a, b) => {
      if (Array.isArray(b.data) && Array.isArray(a.data))
        return b.data.reduce((acc, curr) => acc + curr.damage, 0) - a.data.reduce((acc, curr) => acc + curr.damage, 0)

      if ('amount' in b.data && 'amount' in a.data) return b.data.amount - a.data.amount
      return 0
    }),
  )

  let total = $derived(
    eventsByCharacter?.reduce((acc, curr) => {
      if (Array.isArray(curr.data)) return curr.data.reduce((acc, curr) => acc + curr.damage, 0) + acc
      return acc + curr.data.amount
    }, 0),
  )

  function calculateDPS(data: LogEvent[], characterDamage: number, s: typeof start, e: typeof end): number {
    const endTime = e ? data.findLast((event) => event?.eventAt <= Number(e))?.eventAt! : data[data.length - 1]?.eventAt
    const startTime = start ? data.find((event) => event?.eventAt >= Number(s))?.eventAt! : data[0]?.eventAt

    const timeDifferenceInSeconds = (endTime - startTime) / 1000

    return +(characterDamage / (timeDifferenceInSeconds > 0 ? timeDifferenceInSeconds : 1)).toFixed(1)
  }
</script>

<div class="h-72 p-2">
  <Table.Root class="caption-top">
    <Table.Caption>{eventTypeHelpers[type].name}</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-44">Name</Table.Head>
        <Table.Head class="w-auto">{eventTypeHelpers[type].long}</Table.Head>
        <Table.Head class="w-44">{eventTypeHelpers[type].short}</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#if eventsByCharacter && total}
        {#each eventsByCharacter as row}
          {@const characterDamage = !('amount' in row.data)
            ? row.data.reduce((acc, curr) => acc + curr.damage, 0)
            : row.data.amount}
          {#if characterDamage}
            {@const ratio = (+characterDamage / total) * 100}
            <Table.Row class="">
              <Table.Cell class="whitespace-nowrap font-medium">
                <!--
                <a href={resolvePath(row.character?.id, type)}>
                  {row.character?.name}
                </a>
                -->
                {row.character?.name}
              </Table.Cell>
              {#if !('amount' in row.data)}
                <Table.Cell class="">
                  <Tooltip.Root openDelay={0}>
                    <Tooltip.Trigger>
                      <div class="relative grid min-w-56 grid-cols-[3rem,1fr] items-center gap-4">
                        {ratio.toFixed(2)}%
                        <Progress value={ratio} class="h-8 rounded-none" />
                        <div class="absolute right-4 mix-blend-difference">
                          {Math.floor(characterDamage)}
                        </div>
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <Tabletooltip {...tooltipData(row.data, total)} />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Table.Cell>
              {:else if type === 'healingdone'}
                <Table.Cell class="relative grid min-w-56 grid-cols-[3rem,1fr] items-center gap-4">
                  {ratio.toFixed(2)}%
                  <Progress value={ratio} class="h-8 rounded-none" />
                  <div class="absolute right-4 mix-blend-difference">
                    {Math.floor(characterDamage)}
                  </div>
                </Table.Cell>
              {/if}
              <Table.Cell>
                {calculateDPS(data, characterDamage, start, end)}
              </Table.Cell>
            </Table.Row>
          {/if}
        {/each}
      {:else}
        <Table.Row>
          <Table.Cell colspan={3}>No Data</Table.Cell>
        </Table.Row>
      {/if}
    </Table.Body>
  </Table.Root>
</div>
