<script lang="ts">
  import ScrollArea from '@/shadcn/components/ui/scroll-area/scroll-area.svelte'

  import type { PageData } from './$types'
  import Card from '@/components/player/card.svelte'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

{#await data.characters then characters}
  <ScrollArea class="flex gap-2">
    {#each characters as character (character.id)}
      <Card {character} class="max-w-96" />
    {/each}
  </ScrollArea>
{/await}
