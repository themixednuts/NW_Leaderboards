<script lang="ts">
  import { resolveRoute } from '$app/paths'
  import Flyout from '$lib/components/flyout.svelte'
  import { Skeleton } from '@/shadcn/components/ui/skeleton'
  type Props = {
    id: string | undefined
    type: string
  }

  let { id, type }: Props = $props()
</script>

<div class="flex min-w-fit shrink-0 gap-2 whitespace-nowrap">
  {#if id}
    {#await fetch(resolveRoute( `/lb/api/[type]/[id]`, { type, id: id.replace(/\{|\}/g, '') }, )).then( (res) => res.json(), )}
      <div class="flex gap-2">
        <Skeleton class="size-6 rounded-full" />
        <Skeleton class=" h-6" />
      </div>
    {:then data}
      {#if data.name}
        <Flyout {data} />
      {:else}
        <div class="h-6">Private</div>
      {/if}
    {:catch e}
      <div class="h-6">Private</div>
    {/await}
  {/if}
</div>
