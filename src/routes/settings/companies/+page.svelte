<script lang="ts">
  import Card from '@/components/company/card.svelte'
  import type { PageData } from './$types'
  import { normalize_name } from '@/utils'

  interface Props {
    data: PageData
  }
  let { data }: Props = $props()
</script>

<div class="flex w-full flex-col gap-2">
  {#await data.companies}
    loading
  {:then companies}
    {#each companies as guild}
      <a href="/company/{normalize_name(guild.name)}" class="border-x-2">
        <Card {guild} />
      </a>
    {/each}
  {/await}
</div>
