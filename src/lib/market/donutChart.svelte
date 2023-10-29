<script lang="ts">
  import type { Action } from 'svelte/action'
  import { Chart, type ChartConfiguration, type ChartDataset } from 'chart.js/auto'

  export let categories

  const totalCount = categories.filter((row) => row.TradingCategory).reduce((acc, row) => acc + row.count, 0)
  const myChart: Action<HTMLCanvasElement> = (canvas: HTMLCanvasElement) => {
    let chart: Chart | null = new Chart(canvas, {
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
            display: true,
            text: 'Market Volume',
          },
          subtitle: {
            display: true,
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
            animateRotate: true
        },
      },
    })
  }
</script>

  <canvas use:myChart></canvas>
