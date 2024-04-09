<script lang="ts">
  import CompanyHeader from '@/components/company/header.svelte'
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
      {#if guild}
        <a href="/company/{normalize_name(guild.name)}/members" class="">
          <CompanyHeader {guild} />
        </a>
      {/if}
    {/each}
  {/await}
</div>
