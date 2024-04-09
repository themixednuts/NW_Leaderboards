<script lang="ts">
  import * as Table from '@/shadcn/components/ui/table'
  import { cn } from '@/shadcn/utils'
  import type { PageData } from './$types'
  import { normalize_name } from '@/utils'
  import { Date } from 'svelte/reactivity'
  import Members from '@/components/company/members.svelte'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

{#await data.company}
  Loading
{:then guild}
  {#if guild}
    <Members {guild} />
  {/if}
{/await}
