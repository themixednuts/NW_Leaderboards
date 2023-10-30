<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData

  const marketRoutes = ['browser', 'item', 'stats']
</script>

<div class="relative grid grid-cols-3 place-content-center place-items-center border-2">
  {#each marketRoutes as route}
    <div class="flex place-content-center text-4xl font-mono font-extrabold">
      <a href="/market/{route}" class="h-full w-full text-center capitalize">{route}</a>
    </div>
  {/each}
</div>
