<script lang="ts">
  import * as Select from '$lib/shadcn/components/ui/select'
  import * as Table from '$lib/shadcn/components/ui/table'
  import { getRelativeEventTime, translateEvent } from '$lib/utils'
  import { Button } from '$lib/shadcn/components/ui/button'
  import { Input } from '$lib/shadcn/components/ui/input'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import type { LogEvent } from '@/events.types'

  type Props = {
    reports: LogEvent[]
  }

  let { reports }: Props = $props()

  let value = $state(10)
  let start = $derived(Number($page.url.searchParams.get('start')))
  let end = $derived(Number($page.url.searchParams.get('end')))

  let startIdx = $derived(reports.findIndex((report) => report && report.eventAt >= (start || report.eventAt)))
  let endIdx = $derived(reports.findLastIndex((report) => report && report.eventAt <= (end || report.eventAt)))

  let eventStart = $derived(Number($page.url.searchParams.get('eventStart')))
  let index_reports = $derived(reports.slice(startIdx, endIdx))
  let eventStartIdx = $derived(index_reports.findIndex((event) => event.eventAt >= (eventStart || start)))
  let sliced_reports = $derived(index_reports.slice(eventStartIdx, eventStartIdx + value))

  function nextTen() {
    const search = new URLSearchParams($page.url.search)
    const nextEvent = index_reports[eventStartIdx + value] ?? index_reports[index_reports.length - 1]
    search.set('eventStart', nextEvent.eventAt.toString())
    return search
  }
  function prevTen() {
    const search = new URLSearchParams($page.url.search)
    const prevEvent = index_reports[Math.max(eventStartIdx - value, 0)].eventAt
    if (prevEvent <= 0) search.delete('eventStart')
    else search.set('eventStart', prevEvent.toString())
    return search
  }
  function manualGoTo(pg: string) {
    const search = new URLSearchParams($page.url.search)
    const newStart = +pg * value
    if (newStart <= 0) search.delete('eventStart')
    else search.set('eventStart', newStart.toString())
    return search
  }
</script>

<div class="flex w-full">
  <Select.Root onSelectedChange={(v) => (value = v?.value as number)}>
    <Select.Trigger class="w-16 justify-end">
      <Select.Value placeholder={value.toString()} />
    </Select.Trigger>
    <Select.Content>
      <Select.Item value={10}>10</Select.Item>
      <Select.Item value={15}>15</Select.Item>
      <Select.Item value={20}>20</Select.Item>
      <Select.Item value={25}>25</Select.Item>
    </Select.Content>
  </Select.Root>
</div>
<Table.Root class="caption-top">
  <Table.Caption>Events</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-min">Time</Table.Head>
      <Table.Head class="">Event</Table.Head>
      <!-- <Table.Head>Source</Table.Head>
			<Table.Head>Type</Table.Head>
			<Table.Head>SubType</Table.Head>
			<Table.Head>Data</Table.Head>
			<Table.Head>Target</Table.Head> -->
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each sliced_reports as report, i}
      <Table.Row>
        <Table.Cell class="w-24">{getRelativeEventTime(report.eventAt, reports[0].eventAt)}</Table.Cell>
        <Table.Cell>{translateEvent(report)}</Table.Cell>
        <!-- <Table.Cell class="">{report.data.playerName! ?? report.data.npcName ?? ''}</Table.Cell>
				<Table.Cell class="">{report.type}</Table.Cell>
				<Table.Cell>{report.subtype}</Table.Cell>
				<Table.Cell class=" whitespace-pre-line">{getEventValue(report)}</Table.Cell>
				<Table.Cell class="">{report.data.marker?.npcName ?? report.data.marker?.playerName ?? ''}</Table.Cell> -->
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>

<div class="flex justify-between">
  <Button disabled={eventStartIdx <= 0}>
    <a href="{$page.url.pathname}/?{prevTen()}" class="size-full">Prev</a>
  </Button>
  <div class="flex items-center justify-center gap-2">
    <Input
      placeholder={String(Math.floor((eventStartIdx + value) / value))}
      class="w-16 text-right"
      onchange={(e) => goto($page.url.pathname + '/?' + manualGoTo(e.currentTarget.value))}
    />
    <div class="flex items-center justify-center">/</div>
    {Math.ceil(index_reports.length / value)}
  </div>
  <Button disabled={eventStartIdx >= reports.length - value}>
    <a href="{$page.url.pathname}/?{nextTen()}" class="size-full">Next</a>
  </Button>
</div>
