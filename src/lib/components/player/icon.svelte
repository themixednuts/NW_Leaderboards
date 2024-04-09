<script lang="ts">
  import { page } from '$app/stores'
  import type { getCharacterById } from '@/server/db/gamedata/helpers'
  import { cn } from '@/shadcn/utils'

  interface Props {
    character: NonNullable<Awaited<ReturnType<typeof getCharacterById>>>
  }
  let { character }: Props = $props()
</script>

<div
  class={cn(
    'grid aspect-square max-w-24 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] place-content-center place-items-center overflow-clip rounded-[50%] border-2',
    {
      'border-faction-background-1-dark': character.factionId === 1,
      'border-faction-background-2-dark': character.factionId === 2,
      'border-faction-background-3-dark': character.factionId === 3,
    },
  )}
>
  {#if character.backgroundImagePath && character.foregroundImagePath}
    <img
      loading="lazy"
      src="/{character.backgroundImagePath?.toLowerCase().replace('.dds', '.png')}"
      alt=""
      class={cn('col-start-1 row-start-1 min-w-0 rounded-[50%]')}
    />
    <img
      loading="lazy"
      src="/{character.midgroundImagePath?.toLowerCase().replace('.dds', '.png')}"
      alt=""
      class="col-start-1 row-start-1 min-w-0 rounded-[50%]"
    />
    <img
      loading="lazy"
      src="/{character.foregroundImagePath?.toLowerCase().replace('.dds', '.png')}"
      alt=""
      class="col-start-1 row-start-1 min-w-0 rounded-[50%]"
    />
  {:else if character.ownedByUser}
    <img loading="lazy" src={$page.data.session?.user?.image} alt="" class="col-start-1 row-start-1 min-w-0" />
  {/if}
</div>
