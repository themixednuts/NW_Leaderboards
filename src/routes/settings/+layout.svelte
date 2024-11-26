<script lang="ts">
  import { Buildings, ChartLine, FileArrowUp, User, Users, UsersThree } from 'phosphor-svelte'
  import type { LayoutData } from './$types'
  import { cn } from '@/shadcn/utils'
  import { page } from '$app/stores'
  import { Button } from '@/shadcn/components/ui/button'
  import type { Snippet } from 'svelte'

  interface Props {
    data: LayoutData
    children: Snippet
  }
  let { data, children }: Props = $props()

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
        {
          icon: ChartLine,
          link: '/settings/logs',
          label: 'Logs',
          roles: ['maintainer', 'admin'],
        },
      ],
    },
    {
      group: 'Upload',
      items: [
        {
          icon: FileArrowUp,
          link: '/settings/upload/game',
          label: 'Game Log',
        },
        {
          icon: FileArrowUp,
          link: '/settings/upload/combat',
          label: 'Combat Log',
          roles: ['maintainer', 'admin'],
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
      {#each option.items as { roles, icon: Icon, link, label }}
        {#if !roles || roles.includes(data?.session?.user?.role)}
          <div
            class={cn(' flex w-full place-items-center gap-2 border-transparent', {
              'border-r-4 border-r-blue-bright': $page.url?.pathname.includes(link),
            })}
          >
            <Button variant="secondary" href={link} class="h-12 w-full justify-start gap-2">
              <Icon></Icon>
              {label}
            </Button>
          </div>
        {/if}
      {/each}
    {/each}
  </div>

  <div class="flex h-full grow">
    {@render children()}
  </div>
</div>
