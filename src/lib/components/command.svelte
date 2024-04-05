<script lang="ts">
  import * as Command from '@/shadcn/components/ui/command'
  import type { ActionData, SubmitFunction } from '../../routes/$types'
  import { applyAction, enhance } from '$app/forms'
  import { page } from '$app/stores'
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'
  import { normalize_name } from '@/utils'

  let form: ActionData = $derived($page.form)
  let formEl: HTMLFormElement | undefined = $state()
  let value: string = $state('')

  let characters: NonNullable<typeof form>['results'] = $state([])
  let guilds: NonNullable<typeof form>['results'] = $state([])

  let cmd: Writable<boolean> = getContext('cmd')

  let cmdInput: HTMLInputElement | undefined = $state()
  const handleSubmit = (async ({ formData }) => {
    if (value) formData.set('q', value)
    return async ({ result, update }) => {
      if (result.type === 'success') {
        const { data } = result
        if (data) {
          characters = data.results.filter((res) => res.type === 'character')
          guilds = data.results.filter((res) => res.type === 'guild')
        }
      }
    }
  }) satisfies SubmitFunction

  let timer: ReturnType<typeof setTimeout> | undefined = $state()
  function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(callback: T, delay: number) {
    return new Promise<ReturnType<T> | Error>((resolve, reject) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        try {
          //@ts-expect-error
          resolve(callback())
        } catch (err) {
          if (err instanceof Error) {
            reject(err)
          }
          reject(new Error(`An error has occurred: ${err}`))
        }
      }, delay)
    })
  }
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === '/') {
      e.preventDefault()
      $cmd = true
    }
  }}
/>

<form
  class="ml-auto flex-1 sm:flex-initial"
  method="post"
  action="/?/search"
  use:enhance={handleSubmit}
  bind:this={formEl}
>
  <Command.Dialog label="Search" bind:open={$cmd} class="">
    <Command.Input
      placeholder="Search players, companies..."
      class="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
      name="q"
      bind:value
      autofocus
      oninput={() =>
        debounce(() => {
          if (value.length) formEl?.requestSubmit()
          else {
            characters = []
            guilds = []
          }
        }, 500)}
      bind:el={cmdInput}
    />
    <Command.List>
      <Command.Empty>No results found</Command.Empty>
      <Command.Group heading="Characters" alwaysRender={false}>
        {#if characters?.length}
          {#each characters as character (character.id)}
            <Command.Item onSelect={() => ($cmd = false)}>
              <a href="/character/{normalize_name(character.name)}" class="size-full">
                {character.name}
              </a>
            </Command.Item>
          {/each}
        {/if}
      </Command.Group>
      <Command.Separator alwaysRender />
      <Command.Group heading="Guilds">
        {#if guilds?.length}
          {#each guilds as guild (guild.id)}
            <Command.Item onSelect={() => ($cmd = false)}>
              <a href="/company/{normalize_name(guild.name)}" class="size-full">
                {guild.name}
              </a>
            </Command.Item>
          {/each}
        {/if}
      </Command.Group>
    </Command.List>
  </Command.Dialog>
</form>
