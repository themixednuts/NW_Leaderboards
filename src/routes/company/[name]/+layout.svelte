<script lang="ts">
  import Card from '@/components/company/card.svelte'
  import type { LayoutData } from './$types'
  import { ScrollArea } from '@/shadcn/components/ui/scroll-area'
  import { cn } from '@/shadcn/utils'
  import { page } from '$app/stores'
  import { Button } from '@/shadcn/components/ui/button'
  import CompanyHeader from '@/components/company/header.svelte'

  interface Props {
    data: LayoutData
  }
  let { data }: Props = $props()

  let pages = $derived([
    {
      label: 'Members',
      href: `/company/${$page.params.name}/members`,
      onPage: $page.url.pathname.split('/').includes('members'),
    },
    // {
    //   label: 'Wars',
    //   href: `/company/${$page.params.name}/wars`,
    //   onPage: $page.url.pathname.split('/').includes('wars'),
    // },
    // {
    //   label: 'Treasury',
    //   href: `/company/${$page.params.name}/treasury`,
    //   onPage: $page.url.pathname.split('/').includes('treasury'),
    // },
  ])
</script>

<div class="container flex w-full flex-col place-items-center gap-4 px-0">
  {#await data.company}
    Loading
  {:then guild}
    {#if guild}
      <CompanyHeader {guild} />
      <div class="flex h-10 w-full place-items-center gap-2">
        {#each pages as pg}
          <Button
            href={pg.href}
            variant="secondary"
            class={cn('min-w-40 rounded-full px-2', {
              'bg-primary': pg.onPage,
            })}
          >
            {pg.label}
          </Button>
        {/each}
      </div>
      <div class="w-full rounded-2xl border-2 p-2">
        <slot />
      </div>
    {/if}
  {/await}
</div>
