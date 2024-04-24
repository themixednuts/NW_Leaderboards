<script context="module">
  type Props<TType extends ChartType = ChartType> = {
    datasets: ChartDataset<TType>[]
    type?: TType
    start?: number
    end?: number
    onZoomReset?: ChartContext
    onPanComplete?: ChartContext
    onZoomComplete?: ChartContext
    tick?: TickContext
  }

  export type ChartCallbacks = Pick<Props, 'onZoomComplete' | 'onPanComplete' | 'onZoomReset' | 'tick'>
</script>

<script lang="ts">
  import { type ChartType, type ChartDataset } from 'chart.js'
  import { onMount } from 'svelte'
  import { Button } from '$lib/shadcn/components/ui/button'
  import { MagnifyingGlass } from 'phosphor-svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { ChartContext, TickContext } from './utils.svelte'
  import { createChart } from './action.svelte'

  let {
    datasets,
    type = 'line',
    end = $bindable(),
    start = $bindable(),
    onZoomReset,
    onZoomComplete,
    onPanComplete,
    tick,
    ...restProps
  }: Props & HTMLAttributes<HTMLDivElement> = $props()

  let zoomPlugin: typeof import('chartjs-plugin-zoom') | undefined = $state()
  const chartState = new createChart()
  const { action } = chartState

  onMount(async () => {
    zoomPlugin = await import('chartjs-plugin-zoom')
  })
</script>

<div class="relative h-56" {...restProps}>
  {#if chartState.isZoomed || start || end}
    <Button
      class="absolute right-2 top-2"
      onclick={() => {
        const { chart } = chartState
        if (chart) {
          chart.resetZoom('resize')
          if (onZoomReset) onZoomReset({ chart })
        }
      }}
    >
      <MagnifyingGlass class="pointer-events-none" />
    </Button>
  {/if}
  {#if zoomPlugin}
    <canvas use:action={{ datasets, zoomPlugin, onPanComplete, onZoomComplete, tick, start, end }}></canvas>
  {/if}
</div>
