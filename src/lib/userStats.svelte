<script lang="ts">
  import type { LayoutData } from '../routes/$types'
  export let json: Promise<LayoutData['users']>

</script>

<div class="stat place-items-center">
  {#await json}
    <div class="loading"></div>
  {:then promise}
    {@const current = Intl.NumberFormat().format(Number(promise.current.data[0].count))}
    {@const compare = (Number(promise.current.data[0].count) / Number(promise.last.data[0].count) - 1) * 100}
    {@const all = Intl.NumberFormat().format(Number(promise.all.data[0].count))}
    <div class="stat-figure text-secondary" />
    <div class="stat-title text-sm md:text-base">New Unique Characters</div>
    <div class="stat-value text-base text-secondary md:text-4xl">
      {current}
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
            class="inline-block h-4 w-4 stroke-current">
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
        <span class="text-secondary">{all}</span>
      </div>
    </div>
  {:catch e}
    <span>No Data: {e}</span>
  {/await}
</div>
