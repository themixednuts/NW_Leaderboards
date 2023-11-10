<script lang="ts">
  import type { Action } from 'svelte/action'
  import { Chart, type ChartDataset } from 'chart.js/auto'
  import type { MarketData } from '$lib/market.types'
  import 'chartjs-adapter-date-fns'
  import * as stats from 'simple-statistics'
  // import zoomPlugin from 'chartjs-plugin-zoom'
  import annotationPlugin, { type AnnotationOptions } from 'chartjs-plugin-annotation'

  Chart.register(annotationPlugin)
  export let itemData: MarketData[]
  export let title: string
  export let days: number

  const formatter = new Intl.NumberFormat(undefined, {
    notation: 'compact',
    compactDisplay: 'short',
  })

  // const processedData = itemData.map((item) => {
  //   // Split perks and trim spaces
  //   const perks = item.perks.split(',').map((perk) => perk.trim())
  //   return {
  //     ...item,
  //     perks,
  //   }
  // })
  // const uniquePerks = Array.from(new Set(processedData.flatMap((item) => item.perks)))

  // const perkEffects: Record<string, number> = {}

  // uniquePerks.forEach((perk) => {
  //   const prices = processedData.filter((item) => item.perks.includes(perk)).map((item) => item.price)

  //   if (prices.length > 1) {
  //     // Perform linear regression to estimate the effect of the perk on prices
  //     const x = prices.map((price, index) => [index])
  //     const y = prices
  //     const regression = stats.linearRegression([x, y])
  //     perkEffects[perk] = regression.m
  //   }
  // })
  // console.log(perkEffects)

  const myChart: Action<HTMLCanvasElement, MarketData[]> = (canvas: HTMLCanvasElement, itemData: MarketData[]) => {
    const resultMap = new Map()
    const labels = []
    const currentDate = new Date()
    const n = 2

    for (let i = days; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setDate(date.getDate() - i)
      labels.push(date.getTime())
    }

    const totalPrice = itemData.reduce((total, item) => total + (item.price / 100) * item.quantity, 0)
    const totalQuantity = itemData.reduce((total, item) => total + item.quantity, 0)
    const avgPrice = totalPrice / totalQuantity

    const priceStdDev = Math.sqrt(
      itemData.reduce((total, item) => total + item.quantity * Math.pow(item.price / 100 - avgPrice, 2), 0) /
        totalQuantity,
    )

    const priceUpperBound = avgPrice + n * priceStdDev
    const priceLowerBound = avgPrice - n * priceStdDev
    const avgAnnotation: AnnotationOptions = {
      type: 'line',
      borderColor: 'rgba(100,100,100,.50)',
      borderDash: [5, 5],
      borderDashOffset: 0,
      borderWidth: 1,
      label: {
        display: true,
        borderColor: 'rgba(100,100,100,.80)',
        backgroundColor: 'rgba(100,100,100,.10)',
        textStrokeColor: 'rgba(5,0,0,.10)',
        drawTime: 'afterDatasetsDraw',
        content: (ctx) => formatter.format(avgPrice),
        position: 'start',
        rotation: -90,
      },
      scaleID: 'y',
      value: (ctx) => avgPrice,
    }
    const lowerAnnotation: AnnotationOptions = {
      type: 'line',
      borderColor: 'rgba(100,100,100,.30)',
      borderDash: [5, 5],
      borderDashOffset: 0,
      borderWidth: 1,
      label: {
        display: false,
        backgroundColor: 'rgba(100,100,100,.30)',
        content: (ctx) => priceLowerBound.toFixed(2),
        position: 'start',
        rotation: -90,
      },
      scaleID: 'y',
      value: (ctx) => (priceLowerBound > 0 ? priceLowerBound.toFixed(2) : 0),
    }
    const upperAnnotation: AnnotationOptions = {
      type: 'line',
      borderColor: 'rgba(100,100,100,.30)',
      borderDash: [5, 5],
      borderDashOffset: 0,
      borderWidth: 1,
      label: {
        display: false,
        backgroundColor: 'rgba(100,100,100,.30)',
        content: (ctx) => priceUpperBound.toFixed(2),
        position: 'start',
        rotation: -90,
      },
      scaleID: 'y',
      value: (ctx) => priceUpperBound.toFixed(2),
    }
    const groupedData: Map<string, MarketData[]> = itemData.reduce((result, item) => {
      const { sessionDate, price } = item

      if (!result.has(sessionDate)) {
        result.set(sessionDate, [])
      }

      const group = result.get(sessionDate)
      group.push({ ...item, sessionDate, price: price / 100 })

      return result
    }, new Map())

    groupedData.forEach((item, idx, arr) => {
      const prices = item.map((item) => item.price)
      const minPice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const totalPrice = item.reduce((total, item) => total + item.price * item.quantity, 0)
      const totalQuantity = item.reduce((total, item) => total + item.quantity, 0)
      const avgPrice = totalPrice / totalQuantity

      // const priceStdDev = Math.sqrt(
      //   item.reduce((total, item) => {
      //     const squaredDifferences = Array(item.quantity)
      //       .fill(item.price - avgPrice)
      //       .map((diff) => Math.pow(diff, 2))

      //     return squaredDifferences.reduce((acc, val) => acc + val, 0) + total
      //   }, 0) / totalQuantity,
      // )

      // const priceUpperBound = avgPrice + n * priceStdDev
      // const priceLowerBound = avgPrice - n * priceStdDev

      resultMap.set(item[0].sessionDate, {
        min: minPice.toFixed(2),
        max: maxPrice.toFixed(2),
        average: avgPrice.toFixed(2),
        quantity: totalQuantity,
        // priceLowerBound,
        // priceUpperBound,
        // priceStdDev,
      })
    })

    const chartData: ChartDataset[] = []
    for (const [key, value] of resultMap.entries()) {
      let inputDate: Date
      const unixTimeStampPattern = /^[0-9]+$/
      if (unixTimeStampPattern.test(key)) inputDate = new Date(+key * 1000)
      else inputDate = new Date(key)
      const formattedDate = inputDate.getTime()
      chartData[0] ??= {
        data: [],
        borderWidth: 2,
        label: 'Avg (Gold)',
      }
      chartData[1] ??= {
        data: [],
        borderWidth: 2,
        label: 'Min (Gold)',
      }
      chartData[2] ??= {
        data: [],
        borderWidth: 2,
        label: 'Max (Gold)',
      }
      chartData[3] ??= {
        data: [],
        borderWidth: 2,
        label: 'Quantity',
        yAxisID: 'y1',
        borderDash: [5, 5],
      }

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

      chartData[0].data.push(avg)
      chartData[1].data.push(min)
      chartData[2].data.push(max)
      chartData[3].data.push(quantity)
    }

    let chart: Chart | null = new Chart(canvas, {
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
          tooltip: {
            mode: 'index',
          },
          annotation: {
            annotations: {
              avgAnnotation,
              lowerAnnotation,
              upperAnnotation,
            },
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
              text: 'Gold',
            },
            position: 'left',
            beginAtZero: true,
            ticks: {
              callback(tickValue, index, ticks) {
                return formatter.format(+tickValue)
              },
            },
          },
          y1: {
            title: {
              display: true,
              text: 'Quantity',
            },
            position: 'right',
            beginAtZero: true,
            ticks: {
              callback(tickValue, index, ticks) {
                const formatter = new Intl.NumberFormat(undefined, {
                  notation: 'compact',
                  compactDisplay: 'short',
                })
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
