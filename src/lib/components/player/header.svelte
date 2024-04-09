<script lang="ts">
  import type { getCharacterById } from '@/server/db/gamedata/helpers'
  import { cn } from '@/shadcn/utils'
  import { type WorldsData, steamAppIdMap, normalize_name } from '@/utils'
  import { Eye, EyeClosed, EyeSlash } from 'phosphor-svelte'
  import * as DropdownMenu from '@/shadcn/components/ui/dropdown-menu'
  import { toast } from 'svelte-sonner'
  import * as Card from '@/shadcn/components/ui/card'
  import { Skeleton } from '@/shadcn/components/ui/skeleton'
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms'
  import { page } from '$app/stores'
  import { zodClient } from 'sveltekit-superforms/adapters'
  import { characters, visibilitySchema } from '$lib/schemas/gamedata'
  import { Input } from '@/shadcn/components/ui/input'
  import Icon from './icon.svelte'

  interface Props {
    character: NonNullable<Awaited<ReturnType<typeof getCharacterById>>>
  }

  let { character }: Props = $props()

  let form = $state(
    superForm(
      $page.data.visibilityForm as SuperValidated<
        Infer<typeof visibilitySchema>,
        { update: { name: typeof characters.$inferSelect.name; visibility: typeof characters.$inferSelect.visibility } }
      >,
      {
        validators: zodClient(visibilitySchema),
        invalidateAll: false,
        id: character.name,
        onError: ({ result: { status, error } }) => {
          if (status) toast.error(status.toString(), { description: error.message })
        },
        onUpdated: ({ form: { valid, message } }) => {
          if (valid && message) {
            toast.success('Updated Visility', {
              description: `Visibility for ${message.update.name} changed to ${message.update.visibility}`,
            })
            visibility = message.update.visibility
          }
          if (!valid) {
            toast.error('Failed to update', {
              description: `Visibility for ${character.name} failed. Reverted back to ${character.visibility}`,
            })
            visibility = character.visibility
          }
        },
      },
    ),
  )

  let visibility = $state(character.visibility)

  let { enhance } = form
</script>

<div class="grid min-w-min grid-cols-[minmax(0,1fr),minmax(0,2fr)] grid-rows-[minmax(0,1fr)] gap-2 overflow-clip p-2">
  <div class="relative col-start-1 row-start-1 min-w-min">
    <Icon {character} />
    {#if character.level}
      <div
        class="absolute bottom-[0rem] left-3 rounded-full text-lg drop-shadow-lg backdrop-blur before:absolute before:left-1/2 before:-z-10 before:h-full before:w-[150%] before:-translate-x-1/2 before:rotate-45 before:border-2 before:border-stone-500 before:bg-black before:shadow-lg before:backdrop-blur"
      >
        {character.level}
      </div>
    {/if}
  </div>
  <div class="col-start-2 row-start-1 flex min-w-min flex-col">
    <div class="truncate">
      <Card.Title>
        <a href="/character/{normalize_name(character.name)}">
          {character.name}
        </a>
      </Card.Title>
      <Card.Description class="">
        {#await $page.data.worlds as Promise<WorldsData>}
          <Skeleton class="h-2 w-6" />
        {:then worlds}
          {worlds?.servers?.find((server) => server.worldId === character.worldId)?.worldName}
        {/await}
      </Card.Description>
    </div>
    {#if character.guild}
      <Card.Description>
        <a href="/company/{normalize_name(character.guild.name)}/members" class="text-xs">
          Company: {character.guild.name}
        </a>
      </Card.Description>
    {/if}

    <!-- <div class="col-span-5 col-start-4 row-start-3">{character.faction?.name}</div> -->
    <!-- <div class="flex grow items-end justify-end text-xl font-medium">
      {700}
    </div> 
    -->
    {#if character.steamAppId && steamAppIdMap[character.steamAppId as keyof typeof steamAppIdMap] !== 'Live'}
      <div
        class="relative flex rotate-45 items-center justify-center capitalize before:absolute before:left-1/2 before:top-1/2 before:-z-10 before:h-3/5 before:w-[500%] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-gray-600"
      >
        {steamAppIdMap[character.steamAppId! as keyof typeof steamAppIdMap]}
      </div>
    {/if}
  </div>
  {#if character.ownedByUser}
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        class="col-start-2 row-start-1 flex min-h-8 min-w-8 max-w-10 place-content-center place-items-center self-start justify-self-end border-2"
      >
        {#if visibility === 'public'}
          <Eye class=" size-full p-1" />
        {:else if visibility === 'private'}
          <EyeClosed />
        {:else}
          <EyeSlash />
        {/if}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="right" align="start">
        <DropdownMenu.Label>Visibility</DropdownMenu.Label>
        <form method="post" action="/settings/characters?/visibility" use:enhance>
          <DropdownMenu.RadioGroup bind:value={visibility}>
            <button class="flex size-full">
              <DropdownMenu.RadioItem value="public" class="w-full">Public</DropdownMenu.RadioItem>
            </button>
            <button class="flex size-full">
              <DropdownMenu.RadioItem value="guild" class="w-full">Guild</DropdownMenu.RadioItem>
            </button>
            <button class="flex size-full">
              <DropdownMenu.RadioItem value="private" class="w-full">Private</DropdownMenu.RadioItem>
            </button>
            <Input name="visibility" value={visibility} type="hidden" />
            <Input name="name" value={character.name} type="hidden" />
          </DropdownMenu.RadioGroup>
        </form>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  {/if}
</div>
