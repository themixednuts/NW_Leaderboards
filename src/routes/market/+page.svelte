<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData

  const marketRoutes = ['browser', 'items', 'stats']
</script>

<svelte:head>
  <title>NW Stats - Market</title>
  <meta content="New World Stats" property="og:title" />
  <meta content="Market Home Page" property="og:description" />
</svelte:head>

<div class="relative grid grid-cols-1 auto-rows-auto place-items-center border-2 border-stone-500">
  {#each marketRoutes as route}
    <div class="flex place-content-center font-mono text-4xl font-extrabold">
      <a href="/market/{route}" class="h-full w-full text-center capitalize">{route}</a>
    </div>
  {/each}
</div>
