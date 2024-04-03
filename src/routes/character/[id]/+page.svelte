<script lang="ts">
  import Card from '@/components/player/card.svelte'
  import type { PageData } from './$types.js'

  interface Props {
    data: PageData
  }
  let { data }: Props = $props()
</script>

<div class="container flex place-content-center">
  {#await data.character}
    Loading
  {:then character}
    {#if character}
      <Card {character} />
    {/if}
  {/await}
</div>
