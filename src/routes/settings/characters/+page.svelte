<script lang="ts">
  import ScrollArea from '@/shadcn/components/ui/scroll-area/scroll-area.svelte'

  import type { ActionData, PageData } from './$types'
  import Card from '@/components/player/card.svelte'
  import { onMount } from 'svelte'

  interface Props {
    data: PageData
    form: ActionData
  }

  let { data }: Props = $props()
  let characters: Awaited<typeof data.characters> | undefined = $state()

  onMount(async () => {
    characters = await data.characters
  })
</script>

<ScrollArea>
  <div class="flex gap-4">
    {#if characters}
      {#each characters as character, i (character.name)}
        <Card {character} class="min-h-0 max-w-96" />
      {/each}
    {/if}
  </div>
</ScrollArea>
