<script lang="ts">
  import type { Action } from 'svelte/action'
  import { Chart, type ChartDataset } from 'chart.js/auto'
  import type { MarketData } from '$lib/market.types'
  import 'chartjs-adapter-date-fns'

  export let itemData: MarketData[]
  export let title: string

  const formatter = new Intl.NumberFormat(undefined, {
    notation: 'compact',
    compactDisplay: 'short',
  })

  const myChart: Action<HTMLCanvasElement, MarketData[]> = (canvas: HTMLCanvasElement, itemData: MarketData[]) => {
    const num_of_bins = 10

    const prices = itemData.reduce((acc, item) => {
      const totalPrices = Array(item.quantity).fill(item.price)
      acc.push(...totalPrices)
      return acc
    }, [] as number[])

    const totalMinPrice = itemData.reduce((acc, item) => Math.min(acc, item.price / 100), itemData[0].price)
    const totalMaxPrice = itemData.reduce((acc, item) => Math.max(acc, item.price / 100), itemData[0].price)
    const totalPrice = itemData.reduce((total, item) => total + (item.price / 100) * item.quantity, 0)
    const totalQuantity = itemData.reduce((total, item) => total + item.quantity, 0)
    const avgPrice = totalPrice / totalQuantity

    const binWidth = Math.ceil((totalMaxPrice - totalMinPrice) / num_of_bins)
    const binBoundaries = Array.from({ length: num_of_bins }, (_, idx) => {
      const lowerBoundary = totalMinPrice + idx * binWidth
      const upperBoundary = lowerBoundary + binWidth
      return {
        lower: Math.ceil(lowerBoundary),
        upper: Math.ceil(upperBoundary),
      }
    })
    const log = {
      totalMaxPrice,
      totalMinPrice,
      avgPrice,
      binWidth,
      binBoundaries,
    }

    const binFrequencies = Array(num_of_bins).fill(0)
    prices.forEach((price) => {
      const binIdx = binBoundaries.findIndex((boundary) => price >= boundary.lower && price < boundary.upper)
      if (binIdx !== -1) binFrequencies[binIdx]++
    })

    let chart: Chart | null = new Chart(canvas, {
      type: 'bar',
      data: {
        datasets: [
          {
            label: 'Quantity Per Price',
            data: binFrequencies,
            borderRadius: 0,
            borderWidth: 1,
          },
        ],
        labels: binBoundaries.map((boundary) => `${formatter.format(boundary.lower)} - ${formatter.format(boundary.upper)}`),
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: title,
          },
          tooltip: {
            mode: 'index',
          },
          // zoom: {
          //   zoom: {
          //     wheel: {
          //       enabled: true,
          //     },
          //     pinch: {
          //       enabled: true,
          //     },
          //     mode: 'y',
          //   },
          //   pan: {
          //     enabled: true,

          //   },
          //   limits: {

          //     y: {
          //       min: 0
          //     },
          //     y1: {
          //       min: 0
          //     }
          //   }
          // },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Price Brackets',
            },
            ticks: {
              align: 'center',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Quantity',
            },
            position: 'left',
            beginAtZero: true,
            ticks: {
              callback(tickValue, index, ticks) {
                return formatter.format(+tickValue)
              },
            },
          },
        },
      },
    })

    return {
      destroy() {
        chart = null
      },
    }
  }
</script>

<canvas use:myChart={itemData}></canvas>
