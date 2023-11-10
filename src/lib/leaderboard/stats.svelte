<script lang="ts">
  export let title: string
  export let json: LeaderboardAPIBreachesItem | LeaderboardAPILegendaryItem | LeaderboardAPIUserItem

  const value = Intl.NumberFormat().format(Number(json.count))
</script>

<div class="stat place-items-center">
  <div class="stat-title text-sm md:text-base">{title}</div>
  <div class="stat-value text-base text-secondary md:text-4xl">
    {#if value}
      {value}
    {:else}
      <span>No Data</span>
    {/if}
  </div>
  {#if json.date}
    <div class="stat-desc">json.date</div>
  {/if}
</div>
