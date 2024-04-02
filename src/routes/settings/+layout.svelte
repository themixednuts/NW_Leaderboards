<script lang="ts">
  import { Buildings, FileArrowUp, User, Users, UsersThree } from 'phosphor-svelte'
  import type { LayoutData } from './$types'

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
          link: '/settings/company',
          label: 'Company',
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

<div class="flex grow flex-wrap gap-4">
  <div class="flex h-min flex-col p-2">
    {#each options as option}
      <div class="py-2 text-sm">
        {option.group}
      </div>
      <!-- <hr class="p-2" /> -->
      {#each option.items as item}
        <div class="flex place-items-center gap-2">
          <svelte:component this={item.icon} />
          <a href={item.link}>
            {item.label}
          </a>
        </div>
      {/each}
    {/each}
  </div>

  <div class="flex h-full grow">
    <slot />
  </div>
</div>
