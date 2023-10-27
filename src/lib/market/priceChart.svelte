<script lang="ts">
  import type { Action } from 'svelte/action'
  import { Chart, type ChartConfiguration } from 'chart.js/auto'
  import type { MarketData } from '$lib/market.types'
  import 'chartjs-adapter-date-fns'
  // import zoomPlugin from 'chartjs-plugin-zoom'
  import type { PageData } from '../../routes/market/[server]/item/[id]/$types'

  export let itemData: PageData['itemData']
  export let title: string

  const newChart: Action<HTMLCanvasElement, MarketData[]> = (canvas: HTMLCanvasElement, itemData: MarketData[]) => {
    const resultMap = new Map()
    const labels = []
    const currentDate = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      labels.push(date.getTime())
    }

    itemData.forEach((item) => {
      const { sessionDate, price, quantity } = item
      if (!resultMap.has(sessionDate)) {
        resultMap.set(sessionDate, { min: [], max: [], total: { price: 0, quantity: 0 } })
      }

      const normPrice = price / 100

      const entry = resultMap.get(sessionDate)
      entry.min.push(normPrice)
      entry.max.push(normPrice)
      entry.total.price += normPrice * quantity
      entry.total.quantity += quantity
    })

    resultMap.forEach((val, key) => {
      val.min = Math.min(...val.min).toFixed(2)
      val.max = Math.max(...val.max).toFixed(2)
      val.average = (val.total.price / val.total.quantity).toFixed(2)
      val.quantity = val.total.quantity
    })

    const chartData: [] = []
    for (const [key, value] of resultMap.entries()) {
      const inputDate = new Date(key)
      const formattedDate = inputDate.getTime()
      //@ts-expect-error
      chartData[0] ??= {
        data: [],
        borderWidth: 2,
        label: 'Avg (Price)',
      } as ChartConfiguration
      //@ts-expect-error
      chartData[1] ??= {
        data: [],
        borderWidth: 2,
        label: 'Min (Price)',
      } as ChartConfiguration
      //@ts-expect-error
      chartData[2] ??= {
        data: [],
        borderWidth: 2,
        label: 'Max (Price)',
      } as ChartConfiguration
      //@ts-expect-error
      chartData[3] ??= {
        data: [],
        borderWidth: 2,
        label: 'Quantity',
        yAxisID: 'y1',
        borderDash: [5 ,5]
        // type: 'bar',
      } as ChartConfiguration

      const min = {
        x: formattedDate,
        y: value.min,
      }
      const max = {
        x: formattedDate,
        y: value.max,
      }
      const avg = {
        x: formattedDate,
        y: value.average,
      }
      const quantity = {
        x: formattedDate,
        y: value.quantity,
      }

      // console.log(value)
      //@ts-expect-error
      chartData[0].data.push(avg)
      //@ts-expect-error
      chartData[1].data.push(min)
      //@ts-expect-error
      chartData[2].data.push(max)
      //@ts-expect-error
      chartData[3].data.push(quantity)
    }

    let myChart: Chart | null = new Chart(canvas, {
      type: 'line',
      data: {
        datasets: chartData,
        labels,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: title,
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
        scales: {
          x: {
            type: 'time',
            time: {
              tooltipFormat: 'M/d h:mm a',
            },
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Price',
            },
            position: 'left',
            beginAtZero: true,
          },
          y1: {
            title: {
              display: true,
              text: 'Quantity',
            },
            position: 'right',
            beginAtZero: true,
          },
        },
      },
    })

    return {
      destroy() {
        myChart = null
      },
    }
  }
</script>

<canvas use:newChart={itemData}></canvas>
