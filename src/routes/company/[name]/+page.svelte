<script lang="ts">
  import Card from '@/components/company/card.svelte'
  import type { PageData } from './$types.js'

  interface Props {
    data: PageData
  }
  let { data }: Props = $props()
</script>

<div class="container flex place-content-center">
  {#await data.company}
    Loading
  {:then guild}
    {#if guild}
      <Card {guild} variant="lg" />
    {/if}
  {/await}
</div>
