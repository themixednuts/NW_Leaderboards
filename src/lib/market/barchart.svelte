<script lang="ts">
  import type { Action } from 'svelte/action'
  import { Chart } from 'chart.js/auto'
  export let marketcaps: any[]

  const myChart: Action<HTMLCanvasElement> = (canvas: HTMLCanvasElement) => {
    let chart: Chart | null = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: marketcaps.map((server) => server.server),
        datasets: [
          {
            label: 'Value',
            data: marketcaps.map((server) => server.market_cap),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 205, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(201, 203, 207, 0.6)',
            ],
            borderColor: [
              'rgba(255, 99, 132)',
              'rgba(255, 159, 64 )',
              'rgba(255, 205, 86 )',
              'rgba(75, 192, 192 )',
              'rgba(54, 162, 235 )',
              'rgba(153, 102, 255)',
              'rgba(201, 203, 207)',
            ],
            borderWidth: 2,
          },
          {
            label: 'Volume',
            data: marketcaps.map((server) => server.quantity),
            type: 'line',
            yAxisID: 'y1',
            borderWidth: 2,
            backgroundColor: 'gray',
            borderColor: 'gray',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            display: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Value',
            },
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
          y1: {
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Volume',
            },
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

        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Market Supply Per Server',
          },
          tooltip: {
            mode: 'index',
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

<canvas use:myChart></canvas>
