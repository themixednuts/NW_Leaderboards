<script lang="ts">
  import { page } from '$app/stores'
  import type { getCharacterById, getCharactersByUser } from '@/server/db/gamedata/helpers'
  import { cn } from '@/shadcn/utils'
  import { type WorldsData, steamAppIdMap } from '@/utils'
  import { DotsThree, Eye, EyeClosed, EyeSlash } from 'phosphor-svelte'
  import * as DropdownMenu from '@/shadcn/components/ui/dropdown-menu'
  import * as Form from '@/shadcn/components/ui/form'
  import { applyAction, enhance } from '$app/forms'
  import { toast } from 'svelte-sonner'
  import type { SubmitFunction } from '../../../routes/settings/characters/$types'
  import * as Card from '@/shadcn/components/ui/card'
  import { Skeleton } from '@/shadcn/components/ui/skeleton'

  interface Props {
    character: NonNullable<Awaited<ReturnType<typeof getCharacterById>>>
  }

  let { character }: Props = $props()

  let vis = $state(character.visibility)
  let formEl: HTMLFormElement | undefined = $state()

  const handleForm = (({ formData }) => {
    formData.set('visibility', vis)
    formData.set('character', JSON.stringify(character))

    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Updated Visility', {
          description: `Visibility for ${result.data?.upsert[0].name} changed to ${result.data?.upsert[0].visibility}`,
        })
      }
      if (result.type === 'failure') {
        toast.error('Failed to update', {
          description: `Visibility for ${character.name} failed. Reverted back to ${character.visibility}`,
        })
      }
      applyAction(result)
    }
  }) satisfies SubmitFunction

  function submit(value: 'private' | 'public' | 'guild') {
    vis = value
    if (formEl) formEl.requestSubmit()
  }
</script>

<div class="grid min-w-min grid-cols-[minmax(0,1fr),minmax(0,2fr)] grid-rows-[minmax(0,1fr)] gap-2 overflow-clip p-2">
  <div class="relative col-start-1 row-start-1 min-w-min">
    <div
      class=" grid aspect-square max-w-24 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] place-content-center place-items-center overflow-clip rounded-[50%] border-2 border-faction-background-1-dark"
      class:border-faction-background-1-dark={character.factionId === 1}
    >
      {#if character.backgroundImagePath && character.foregroundImagePath}
        <img
          loading="lazy"
          src="/{character.backgroundImagePath?.toLowerCase().replace('.dds', '.png')}"
          alt=""
          class={cn(
            'col-start-1 row-start-1 min-w-0 rounded-[50%]',
            `bg-[${character.backgroundColor?.replace(' ', '')}]`,
          )}
        />
        <img
          loading="lazy"
          src="/{character.midgroundImagePath?.toLowerCase().replace('.dds', '.png')}"
          alt=""
          class="col-start-1 row-start-1 min-w-0 rounded-[50%] bg-[{character.backgroundColor?.replace(' ', '')}]"
        />
      {:else}
        <img loading="lazy" src={$page.data.session?.user?.image} alt="" class="col-start-1 row-start-1 min-w-0" />
      {/if}
    </div>
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
        <a href="/character/{character.id}">
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
        <a href="/company/{character.guild.id}" class="text-xs">
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
        {#if vis === 'public'}
          <Eye class=" size-full p-1" />
        {:else if vis === 'private'}
          <EyeClosed />
        {:else}
          <EyeSlash />
        {/if}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="right" align="start">
        <DropdownMenu.Label>Visibility</DropdownMenu.Label>
        <DropdownMenu.RadioGroup bind:value={vis} onValueChange={(val) => {
          submit(val as 'private')
        }}>
          <DropdownMenu.RadioItem value="public">Public</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="guild">Guild</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="private">Private</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
        <form method="post" action="/settings/characters?/visibility" use:enhance={handleForm} bind:this={formEl} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  {/if}
</div>
