<script lang="ts">
  export let json

  const allUsers = Intl.NumberFormat().format(Number(json.all.data[0].count))
  const currentUsers = Intl.NumberFormat().format(
    Number(json.current.data[0].count)
  )
  const lastUsers = Intl.NumberFormat().format(Number(json.last.data[0].count))

  const compare =
    Number(json.current.data[0].count) / Number(json.last.data[0].count)
</script>

<div class="stat place-items-center">
  <div class="stat-title text-sm md:text-base">Unique Characters</div>
  <div class="stat-value text-base text-secondary md:text-4xl">
    {#if currentUsers}
      {currentUsers}
    {:else}
      <span>No Data</span>
    {/if}
  </div>
  <div class="stat-desc"><span>{compare >= 0 ? "↗︎ Growth" : "↘ Decline︎"}:</span> <span class=" text-accent">{compare.toFixed(2)}%</span></div>
  <div class="stat-desc"><span>All Seasons:</span> <span class="text-secondary">{allUsers}</span></div>
</div>
