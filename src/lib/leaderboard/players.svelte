<script lang="ts">
  import { page } from '$app/stores'
  import { cn } from '@/shadcn/utils'
  import Player from './player.svelte'
  import type { PageData } from '../../routes/lb/[first]/[category]/[second]/[rotation]/[type]/[season]/[page]/$types'
  interface Props {
    players: Awaited<PageData['json']>['data'][number]['entityId']
  }
  let { players }: Props = $props()

  let type = $derived($page.params.type)
</script>

<div
  class={cn('grid grid-cols-1 gap-1', {
    'grid-cols-[repeat(2,minmax(min-content,1fr))]': (players?.length || 0) > 1,
  })}
>
  {#each players as player}
    <Player {player} {type} />
  {/each}
</div>
