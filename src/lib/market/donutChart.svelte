<script lang="ts">
  import type { Action } from 'svelte/action'
  import { Chart } from 'chart.js/auto'

  export let categories: { TradingCategory: string; count: number, server: string }[]

  const totalCount = categories.filter((row) => row.TradingCategory).reduce((acc, row) => acc + row.count, 0)
  const myChart: Action<HTMLCanvasElement> = (canvas: HTMLCanvasElement) => {
    let chart: Chart<'doughnut'> | null = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: categories.filter((row) => row.TradingCategory).map((row) => row.TradingCategory),
        datasets: [
          {
            label: 'Amount',
            data: categories.filter((row) => row.TradingCategory).map((row) => row.count),
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
            display: false,
          },
          title: {
            display: false,
            text: 'Market Volume',
          },
          subtitle: {
            display: false,
            text: 'Quantity Per Category',
            padding: {
              bottom: 10,
              top: -10,
            },
          },
          tooltip: {
            callbacks: {
              label: function (item) {
                const val = item.dataset.data[item.dataIndex]
                return ((val / totalCount) * 100).toFixed(2) + '%'
              },
            },
          },
        },
        responsive: true,
        animation: {
          animateRotate: true,
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
