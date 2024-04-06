<script lang="ts">
  import Card from '@/components/company/card.svelte'
  import type { PageData } from './$types.js'
  import { ScrollArea } from '@/shadcn/components/ui/scroll-area'

  interface Props {
    data: PageData
  }
  let { data }: Props = $props()
</script>

<div class="container w-full place-content-center px-0">
  {#await data.company}
    Loading
  {:then guild}
    {#if guild}
      <Card {guild} variant="lg" />
    {/if}
  {/await}
</div>
