<script lang="ts">
  import { resolveRoute } from '$app/paths'
  import Flyout from '$lib/components/flyout.svelte'
  type Props = {
    id: string | undefined
    type: string
  }

  let { id, type }: Props = $props()
</script>

<div class="flex shrink-0 gap-2">
  {#if id}
    {#await fetch(resolveRoute( `/lb/api/[type]/[id]`, { type, id: id.replace(/\{|\}/g, '') }, )).then( (res) => res.json(), )}
      loading
    {:then data}
      {#if data.id}
        <Flyout {data} />
      {:else}
        <div>Private</div>
      {/if}
    {:catch e}
      <div>Private</div>
    {/await}
  {/if}
</div>
