<script lang="ts">
  export let json

  const allUsers = Intl.NumberFormat().format(Number(json.all.data[0].count))
  const currentUsers = Intl.NumberFormat().format(
    Number(json.current.data[0].count)
  )
  const lastUsers = Intl.NumberFormat().format(Number(json.last.data[0].count))
  const compare =
    (Number(json.current.data[0].count) / Number(json.last.data[0].count) - 1) * 100
</script>

<div class="stat place-items-center">
  <div class="stat-figure text-secondary" />
  <div class="stat-title text-sm md:text-base">Unique Characters</div>
  <div class="stat-value text-base text-secondary md:text-4xl">
    {#if currentUsers}
      {currentUsers}
    {:else}
      <span>No Data</span>
    {/if}
  </div>
  <div class="stat-desc">
    <div>
      <span>{compare >= 0 ? '↗︎ Growth: ' : '↘ Decline︎: '}</span>
      <span class="text-accent">{compare.toFixed(2)}%</span>
      <span class="tooltip" data-tip="from last season">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block w-4 h-4 stroke-current">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
    </div>
    <div>
      <span>All Seasons:</span>
      <span class="text-secondary">{allUsers}</span>
    </div>
  </div>
</div>
