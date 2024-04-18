<script lang="ts">
  import {
    Chart,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    LineElement,
    LineController,
    PointElement,
    TimeSeriesScale,
    type Plugin,
    Filler,
  } from 'chart.js'
  import type { Action } from 'svelte/action'
  import 'chartjs-adapter-date-fns'
  import annotationPlugin from 'chartjs-plugin-annotation'
  import { onMount } from 'svelte'
  import { Button } from '$lib/shadcn/components/ui/button'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { eventTypeHelpers } from '../../../routes/reports/[id]/utils.svelte'
  import type { LogEvent } from '@/events.types'
  import { MagnifyingGlass } from 'phosphor-svelte'

  Chart.register(
    Title,
    TimeSeriesScale,
    Tooltip,
    Legend,
    LineController,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    annotationPlugin,
    Filler,
  )

  type Props = {
    data: LogEvent[]
  }
  let { data }: Props = $props()

  let start = $derived($page.url.searchParams.get('start'))
  let end = $derived($page.url.searchParams.get('end'))

  let zoomPlugin: any = $state()
  let isZoomedOrPanned = $state(false)
  let chart: InstanceType<typeof Chart> | undefined = $state()

  onMount(async () => {
    zoomPlugin = await import('chartjs-plugin-zoom')
    Chart.register(zoomPlugin.default)
  })

  function generateDataset(
    data: any[],
    label: (typeof eventTypeHelpers)[keyof typeof eventTypeHelpers]['name'],
    type: 'damage' | 'healing' | 'death',
    subtype: string,
    backgroundColor: string,
    pointStyle: string,
    s: typeof start,
    e: typeof end,
  ) {
    let currentTotal = $state(0)
    return {
      label: label,
      data: data
        .filter(
          (event) =>
            event &&
            ((event?.type === type && event?.subtype === subtype) || event.type === 'log' || event.type === 'gamemode'),
        )
        .map((event) => {
          if ((!s && !e) || (event.eventAt >= Number(s) && event.eventAt <= Number(e))) {
            if (type === 'damage') {
              if (event.data.damage)
                for (const dmgType of Object.values(event.data?.damage)) {
                  //@ts-expect-error
                  currentTotal += dmgType.damage
                }
            }

            if (type === 'healing') {
              currentTotal += event.data.amount
            }
          }
          const timeDifferenceInSeconds =
            (event?.eventAt - data[data.findIndex((ev) => ev.eventAt >= Number(s)) ?? 0]?.eventAt) / 1000

          // Calculate DPS
          const dps = timeDifferenceInSeconds > 0 ? currentTotal / timeDifferenceInSeconds : 0
          return { x: event?.eventAt, y: dps }
        }),
      borderColor: `rgb(${backgroundColor})`,
      backgroundColor: `rgba(${backgroundColor}, 0.5)`,
      pointBackgroundColor: `rgb(${backgroundColor})`,
      tension: 0.1,
      // fill: 'origin',
      pointRadius: 1,
      pointStyle: pointStyle,
      hoverRadius: 5,
    }
  }

  const hoverLine: Plugin = {
    id: 'hoverline',
    afterDatasetDraw(chart) {
      const {
        ctx,
        chartArea: { top, bottom },
        tooltip,
        scales: { x },
      } = chart

      if (!tooltip?.dataPoints?.length) return
      const xCoor = x.getPixelForValue(tooltip.dataPoints[0].parsed.x)

      ctx.save()
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgb(155,155,155)'
      ctx.setLineDash([6, 6])
      ctx.moveTo(xCoor, top)
      ctx.lineTo(xCoor, bottom)
      ctx.stroke()
      ctx.closePath()
      ctx.setLineDash([])
    },
  }
  function filterByType(dataset: { label: string }) {
    const type = $page.url.searchParams.get('type') as keyof typeof eventTypeHelpers | undefined
    if (!type) return true

    switch (type) {
      case 'damagedone':
        return dataset.label === eventTypeHelpers[type].name
      case 'damagetaken':
        return dataset.label === eventTypeHelpers[type].name
      case 'healingdone':
        return dataset.label === eventTypeHelpers[type].name
      case 'deaths':
        return dataset.label === eventTypeHelpers[type].name
    }
  }

  const action: Action<HTMLCanvasElement, { data: typeof data; start: typeof start; end: typeof end }> = (
    el,
    { data, start, end },
  ) => {
    chart = new Chart(el, {
      type: 'line',
      data: {
        datasets: [
          generateDataset(data, 'Damage Done', 'damage', 'outgoing', '75,150,195', 'circle', start, end),
          generateDataset(data, 'Damage Taken', 'damage', 'incoming', '195,75,75', 'square', start, end),
          generateDataset(data, 'Healing Done', 'healing', 'outgoing', '75,195,75', 'triangle', start, end),
        ].filter(filterByType),
      },
      options: {
        // parsing: true,
        // normalized: true,
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'x', axis: 'x', intersect: false },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'second',
              displayFormats: {
                second: 'mm:ss:SSS',
              },
            },
            ticks: {
              maxTicksLimit: 8,
              includeBounds: true,

              callback(tickValue, index, ticks) {
                const elapsedMilliseconds = ticks[index].value - data[0].eventAt
                const minutes = Math.floor(elapsedMilliseconds / (60 * 1000))
                const seconds = Math.floor((elapsedMilliseconds % (60 * 1000)) / 1000)
                const milliseconds = Math.floor(elapsedMilliseconds % 1000)

                return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`
              },
              // source: 'data',
            },
            // title: {
            // 	display: true,
            // 	text: 'time',
            // },
          },
          y: {
            // stacked: true,
            ticks: {
              count: 5,
            },
            title: {
              display: true,
              text: 'per second',
            },
            grid: {
              display: true,
              // drawOnChartArea: true,
              color: 'rgba(50,50,50)',
              lineWidth: 0.4,
            },
          },
        },
        plugins: {
          tooltip: {
            mode: 'x',
          },

          zoom: {
            pan: {
              enabled: true,
              modifierKey: 'ctrl',
              onPanComplete(ctx) {
                isZoomedOrPanned = ctx.chart.isZoomedOrPanned()
                const url = new URL($page.url)
                url.searchParams.set('start', ctx.chart.scales.x.min.toString())
                url.searchParams.set('end', ctx.chart.scales.x.max.toString())

                goto(url)
              },
            },
            zoom: {
              mode: 'x',
              wheel: {
                enabled: true,
                // modifierKey: 'shift',
              },

              drag: {
                enabled: true,
                threshold: 5,
              },
              onZoomComplete(ctx) {
                isZoomedOrPanned = ctx.chart.isZoomedOrPanned()
                const url = new URL($page.url)
                url.searchParams.set('start', ctx.chart.scales.x.min.toString())
                url.searchParams.set('end', ctx.chart.scales.x.max.toString())

                goto(url)
              },
            },
            limits: {
              x: {
                min: 'original',
                max: 'original',
              },
              y: {
                min: 'original',
                max: 'original',
              },
            },
          },
        },
        transitions: {
          zoom: {
            animation: {
              duration: 300,
            },
          },
        },
      },
      plugins: [hoverLine],
    })

    if (start && end) chart.zoomScale('x', { min: +start, max: +end }, 'resize')

    return {
      destroy() {
        chart?.destroy()
      },
      update({ data, start, end }) {
        console.log('updating chart')
        if (!chart) return
        // if (start && end) chart.zoomScale('x', { min: +start, max: +end }, 'resize')
        // else chart.zoomScale('x', { min: data[0]?.eventAt, max: data[data.length - 1]?.eventAt }, 'resize')
        // chart.data.datasets = [
        //   generateDataset(data, 'Damage Done', 'damage', 'outgoing', '75,150,195', 'circle', start, end),
        //   generateDataset(data, 'Damage Taken', 'damage', 'incoming', '195,75,75', 'circle', start, end),
        //   generateDataset(data, 'Healing Done', 'healing', 'outgoing', '75,195,75', 'triangle', start, end),
        // ].filter(filterByType)
        // chart.update()
      },
    }
  }
</script>

<div class="relative h-56">
  {#if data && zoomPlugin}
    {#if isZoomedOrPanned || start}
      <Button
        class="absolute right-2 top-2"
        onclick={() => {
          chart?.resetZoom('resize')

          const url = new URL($page.url)

          url.searchParams.delete('start')
          url.searchParams.delete('end')

          goto(url)
        }}
      >
        <MagnifyingGlass class="pointer-events-none" />
      </Button>
    {/if}
    <canvas use:action={{ data, start: start, end: end }} />
  {/if}
</div>
