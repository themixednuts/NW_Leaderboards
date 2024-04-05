<script lang="ts">
  import type { getCompanyWithMembersByName } from '@/server/db/gamedata/helpers'
  import * as Card from '@/shadcn/components/ui/card'
  import ScrollArea from '@/shadcn/components/ui/scroll-area/scroll-area.svelte'
  import * as Table from '@/shadcn/components/ui/table'
  import { cn } from '@/shadcn/utils'
  import { FACTIONS, normalize_name } from '@/utils'
  import { Date } from 'svelte/reactivity'

  interface Props {
    guild: NonNullable<Awaited<ReturnType<typeof getCompanyWithMembersByName>>>
    variant?: 'sm' | 'md' | 'lg'
  }
  let { guild, variant }: Props = $props()

  let updatedAt = new Date(guild.updatedAt)
</script>

<Card.Root class="w-full">
  <Card.Header
    class={cn(
      'flex flex-row flex-nowrap place-content-start place-items-center gap-10 border-y-2 bg-gradient-to-br to-transparent to-60%',
      {
        'from-faction-background-1-dark': guild.factionId === 1,
        'from-faction-background-2-dark': guild.factionId === 2,
        'from-faction-background-3-dark': guild.factionId === 3,
      },
    )}
  >
    <div
      class="grid size-16 place-content-center place-items-center bg-black drop-shadow-2xl mask-size-contain mask-position-center"
      style="mask-image: url('/{guild.backgroundImagePath?.replace('dds', 'png')}');"
    >
      <div
        class={cn(
          ` col-start-1 row-start-1 size-16 mask-size-contain mask-repeat-no-repeat mask-position-center mask-composite-add mask-mode-luminance`,
        )}
        style="background: {guild.backgroundColor}; mask-image: url('/{guild.backgroundImagePath?.replace(
          'dds',
          'png',
        )}');"
      />
      <div
        class={cn(
          ` col-start-1 row-start-1 size-16 mask-size-contain mask-repeat-no-repeat mask-position-center mask-composite-add mask-mode-luminance`,
        )}
        style="background: {guild.foregroundColor}; mask-image: url('/{guild.foregroundImagePath?.replace(
          'dds',
          'png',
        )}');"
      />
    </div>
    <div class="flex flex-col place-content-start whitespace-nowrap px-2">
      <Card.Title class="drop-shadow">
        {guild.name}
      </Card.Title>
      {#if guild.guildMaster}
        <Card.Description class="drop-shadow">
          Governor: {guild.guildMaster.name}
        </Card.Description>
      {/if}
    </div>
    <div class="ml-auto flex flex-col">
      <Card.Title>
        <span class="">Members</span>
        <Card.Description class="text-sm">{guild.numPlayers}</Card.Description>
      </Card.Title>
      <Card.Title>
        <span>Claims</span>
        <Card.Description>{guild.numClaims}</Card.Description>
      </Card.Title>
    </div>
  </Card.Header>
  {#if variant && variant !== 'sm'}
    <Card.Content>
      <Table.Root>
        <Table.Caption>Public Members</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head class="w-16"></Table.Head>
            <Table.Head>Name</Table.Head>
            <!-- <Table.Head>Rank</Table.Head> -->
            <Table.Head>Level</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each guild.characters as character}
            <Table.Row>
              <Table.Cell
                class={cn(
                  'grid size-12 grid-cols-1 grid-rows-1 place-content-start place-items-center p-0 contain-paint',
                  {
                    // 'border-faction-background-1-dark': character.factionId === 1,
                    // 'border-faction-background-2-dark': character.factionId === 2,
                    // 'border-faction-background-3-dark': character.factionId === 3,
                  },
                )}
              >
                <img
                  src="/{character.backgroundImagePath?.toLowerCase().replace('dds', 'png')}"
                  alt=""
                  class="col-start-1 row-start-1"
                />
                <img
                  src="/{character.midgroundImagePath?.toLowerCase().replace('dds', 'png')}"
                  alt=""
                  class="col-start-1 row-start-1"
                />
                <img
                  src="/{character.foregroundImagePath?.toLowerCase().replace('dds', 'png')}"
                  alt=""
                  class="col-start-1 row-start-1"
                />
              </Table.Cell>
              <Table.Cell class="">
                <a href="/character/{normalize_name(character.name)}">
                  {character.name}
                </a>
              </Table.Cell>
              <!-- <Table.Cell>Unknown</Table.Cell> -->
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
  {/if}
</Card.Root>
