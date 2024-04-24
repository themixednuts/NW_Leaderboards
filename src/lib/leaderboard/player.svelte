<script lang="ts">
  import Flyout from '$lib/components/flyout.svelte'
  import { Skeleton } from '@/shadcn/components/ui/skeleton'
  import type { PageData } from '../../routes/lb/[first]/[category]/[second]/[rotation]/[type]/[season]/[page]/$types'
  type Props = {
    player: NonNullable<
      Exclude<Awaited<NonNullable<Awaited<PageData['json']>['data'][number]>['entityId']>, string>
    >[number]

    type: string
  }

  let { player, type }: Props = $props()
</script>

<div class="flex min-w-fit shrink-0 gap-2 whitespace-nowrap">
  {#await player}
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
</div>
