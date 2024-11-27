<script lang="ts">
  import Flyout from '$lib/components/flyout.svelte'
  import type { PageData } from '../../routes/lb/[first]/[category]/[second]/[rotation]/[type]/[season]/[page]/$types'
  type Props = {
    player: Awaited<NonNullable<Awaited<PageData['json']>['data'][number]>['entityId']>
    type: string
  }

  let { player, type }: Props = $props()
</script>

<div class="flex min-w-fit shrink-0 gap-2 whitespace-nowrap">
  {#if player}
    <Flyout data={player} />
  {:else}
    <div class="h-6">Private</div>
  {/if}
</div>
