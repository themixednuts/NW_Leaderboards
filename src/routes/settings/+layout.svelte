<script lang="ts">
  import { Buildings, FileArrowUp, User, Users, UsersThree } from 'phosphor-svelte'
  import type { LayoutData } from './$types'
  import { cn } from '@/shadcn/utils'
  import { page } from '$app/stores'
  import { Button } from '@/shadcn/components/ui/button'

  interface Props {
    data: LayoutData
  }
  let { data }: Props = $props()

  const options = [
    {
      group: 'Profile',
      items: [
        {
          icon: User,
          link: '/settings/profile',
          label: 'Profile',
        },
        {
          icon: Users,
          link: '/settings/characters',
          label: 'Characters',
        },
        {
          icon: Buildings,
          link: '/settings/companies',
          label: 'Companies',
        },
      ],
    },
    {
      group: 'Upload',
      items: [
        {
          icon: FileArrowUp,
          link: '/settings/upload',
          label: 'Upload',
        },
      ],
    },
  ]
</script>

<div class="flex grow flex-wrap gap-4 sm:flex-nowrap">
  <div class="flex h-min w-full flex-col gap-2 border-2 p-2 sm:h-full md:max-w-xs">
    {#each options as option}
      <div class="text-sm">
        {option.group}
      </div>
      <!-- <hr class="p-2" /> -->
      {#each option.items as item}
        <div
          class={cn(' flex w-full place-items-center gap-2 border-transparent', {
            'border-r-4 border-r-blue-bright': $page.url?.pathname.includes(item.link),
          })}
        >
          <Button variant="secondary" href={item.link} class="h-12 w-full justify-start gap-2">
            <svelte:component this={item.icon} />
            {item.label}
          </Button>
        </div>
      {/each}
    {/each}
  </div>

  <div class="flex h-full grow">
    <slot />
  </div>
</div>
