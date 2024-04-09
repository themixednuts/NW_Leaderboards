<script lang="ts">
  import type { getCompanyWithMembersByName } from '@/server/db/gamedata/helpers'
  import * as Card from '@/shadcn/components/ui/card'
  import { ScrollArea } from '@/shadcn/components/ui/scroll-area/'
  import * as Table from '@/shadcn/components/ui/table'
  import { cn } from '@/shadcn/utils'
  import { FACTIONS, normalize_name } from '@/utils'
  import * as Collapsible from '@/shadcn/components/ui/collapsible'
  import { Date } from 'svelte/reactivity'
  import { Button } from '@/shadcn/components/ui/button'
  import { PlusSquare } from 'phosphor-svelte'

  interface Props {
    guild: NonNullable<Awaited<ReturnType<typeof getCompanyWithMembersByName>>>
    variant?: 'sm' | 'md' | 'lg'
  }
  let { guild, variant }: Props = $props()

  let updatedAt = new Date(guild.updatedAt)
</script>

<Card.Root class="container w-full border-2 px-0">
  {#if variant && variant !== 'sm'}
    <Card.Content class="p-0">
      <Collapsible.Root>
        <div class="flex w-full items-center justify-start">
          <Collapsible.Trigger asChild let:builder>
            <Button builders={[builder]} variant="ghost" size="icon">
              <PlusSquare class="size-5" />
            </Button>
          </Collapsible.Trigger>
          Members
        </div>
        <Collapsible.Content>
          <ScrollArea></ScrollArea>
        </Collapsible.Content>
      </Collapsible.Root>
    </Card.Content>
    <Card.Footer class="place-content-center text-xs">
      Updated: {updatedAt.toDateString()}
    </Card.Footer>
  {/if}
</Card.Root>
