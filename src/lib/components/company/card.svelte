<script lang="ts">
  import type { getCompanyWithMembersById } from '@/server/db/gamedata/helpers'
  import type { guilds } from '@/server/db/gamedata/schema'
  import * as Card from '@/shadcn/components/ui/card'
  import ScrollArea from '@/shadcn/components/ui/scroll-area/scroll-area.svelte'
  import * as Table from '@/shadcn/components/ui/table'
  import { cn } from '@/shadcn/utils'
  import { FACTIONS } from '@/utils'
  import { Date } from 'svelte/reactivity'

  interface Props {
    guild: NonNullable<Awaited<ReturnType<typeof getCompanyWithMembersById>>>
  }
  let { guild }: Props = $props()

  let updatedAt = new Date(guild.updatedAt)
</script>

<Card.Root class="w-full max-w-4xl">
  <Card.Header class="flex flex-row flex-nowrap place-content-start place-items-center gap-10">
    <div class="grid size-16 place-content-center place-items-center">
      <div
        class={cn(
          ` col-start-1 row-start-1 size-16 mask-size-contain mask-repeat-no-repeat mask-position-center mask-composite-exclude mask-mode-luminance`,
        )}
        style="background: {guild.backgroundColor}; mask-image: url('/{guild.backgroundImagePath?.replace(
          'dds',
          'png',
        )}');"
      />
      <div
        class={cn(
          ` col-start-1 row-start-1 size-16 mask-size-contain mask-repeat-no-repeat mask-position-center mask-composite-exclude mask-mode-luminance`,
        )}
        style="background: {guild.foregroundColor}; mask-image: url('/{guild.foregroundImagePath?.replace(
          'dds',
          'png',
        )}');"
      />
    </div>
    <div class="flex flex-col place-content-start px-2">
      <Card.Title>
        {guild.name}
      </Card.Title>
      <Card.Description>
        {guild.guildMaster?.name}
        <!--        {FACTIONS[guild.factionId]} -->
      </Card.Description>
    </div>
    <div class="ml-auto flex flex-col">
      <Card.Title>
        <span class="">Members</span>
        <Card.Description class="text-sm">{guild.numPlayers}</Card.Description>
      </Card.Title>
      <Card.Title>
        <span>Claims:</span>
        <Card.Description>{guild.numClaims}</Card.Description>
      </Card.Title>
    </div>
  </Card.Header>
  <Card.Content>
    <Table.Root>
      <Table.Caption>Public Members</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Rank</Table.Head>
          <Table.Head>Level</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each guild.characters as character}
          <Table.Row>
            <Table.Cell>
              <a href="/character/{character.id}">
                {character.name}
              </a>
            </Table.Cell>
            <Table.Cell>Unknown</Table.Cell>
            <Table.Cell>
              {character.level}
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </Card.Content>
  <Card.Footer class="place-content-center text-xs">
    Updated: {updatedAt.toDateString()}
  </Card.Footer>
</Card.Root>
