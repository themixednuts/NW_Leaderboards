<script lang="ts">
  import '../app.pcss'

  import { navigating } from '$app/stores'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { signIn, signOut } from '@auth/sveltekit/client'
  import * as Sheet from '@/shadcn/components/ui/sheet'
  import { Button } from '@/shadcn/components/ui/button'
  import * as DropdownMenu from '@/shadcn/components/ui/dropdown-menu'
  import { Toaster } from '@/shadcn/components/ui/sonner'
  import * as Command from '@/shadcn/components/ui/command'

  // types
  import type { Action } from 'svelte/action'
  import type { ActionData, PageData } from './$types.js'

  // icons
  import Search from 'lucide-svelte/icons/search'
  import CircleUser from 'lucide-svelte/icons/circle-user'
  import Package2 from 'lucide-svelte/icons/package-2'
  import Menu from 'lucide-svelte/icons/menu'
  import { Gear, SignIn, SignOut, Question, ChartPieSlice } from 'phosphor-svelte'
  import { applyAction, enhance } from '$app/forms'
  import type { SubmitFunction } from './$types'
  import { afterNavigate } from '$app/navigation'

  interface Props {
    data: PageData
    form: ActionData
  }

  let { data, form }: Props = $props()
  $inspect(form)

  let open = $state(false)
  let formEl: HTMLFormElement | undefined = $state()
  let value: string = $state('')

  let characters: NonNullable<typeof form>['results'] = $state([])
  let guilds: NonNullable<typeof form>['results'] = $state([])

  const progress = $state(tweened(0, { easing: cubicOut }))
  $effect(() => {
    if ($progress === 0.95) progress.set(0.99, { duration: 10000 })
  })

  const nav: Action<HTMLDivElement> = (ele: HTMLDivElement) => {
    progress.set(0.95, { duration: 1000 })
    $effect(() => {
      ele.style.width = `${$progress * 100}%`
    })

    return {
      destroy() {
        progress.set(1, { duration: 0 })
        progress.set(0, { duration: 0 })
      },
    }
  }
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

<svelte:head>
  <script async src="https://nwdb.info/embed.js"></script>
</svelte:head>
<svelte:window
  onkeydown={(e) => {
    if (e.key === '/') {
      e.preventDefault()
      open = true
    }
  }}
/>
<Toaster />

{#if !!$navigating}
  <div class="absolute left-0 top-0 z-[9999] h-1 bg-red-500" use:nav></div>
{/if}

<div class="flex min-h-svh w-full flex-col">
  <header class="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
    <nav
      class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
    >
      {@render logo()}
      <a href="/lb" class="text-muted-foreground transition-colors hover:text-foreground">Leaderboards</a>
      <!-- <a href="##" class="text-muted-foreground transition-colors hover:text-foreground">Orders</a>
      <a href="##" class="text-muted-foreground transition-colors hover:text-foreground">Products</a>
      <a href="##" class="text-muted-foreground transition-colors hover:text-foreground">Customers</a>
      <a href="##" class="text-foreground transition-colors hover:text-foreground">Settings</a> -->
    </nav>
    <Sheet.Root>
      <Sheet.Trigger asChild let:builder>
        <Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
          <Menu class="h-5 w-5" />
          <span class="sr-only">Toggle navigation menu</span>
        </Button>
      </Sheet.Trigger>
      <Sheet.Content side="left">
        <nav class="grid gap-6 text-lg font-medium">
          {@render logo()}
          <a href="/lb" class="text-muted-foreground transition-colors hover:text-foreground">Leaderboards</a>
        </nav>
      </Sheet.Content>
    </Sheet.Root>
    <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <Button
        variant="outline"
        onclick={() => (open = true)}
        class="ml-auto flex flex-nowrap place-items-center justify-start gap-2 px-2 contain-paint sm:w-[300px] md:w-[200px] lg:w-[300px]"
      >
        <Search class="pointer-events-none shrink-0" />
        <div class="pointer-events-none shrink opacity-70">Characters, companies...</div>
        <kbd class="ml-auto shrink-0">/</kbd>
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
            {#if data.session?.user}
              <img src={data.session.user.image} class="aspect-square rounded-full" alt="user" />
            {:else}
              <CircleUser class="h-5 w-5" />
            {/if}
            <span class="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          {#if data.session?.user}
            <DropdownMenu.Label>
              {data.session.user.name}
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>
              <a href="/settings/profile" class="flex place-items-center gap-2 whitespace-nowrap">
                <Gear />
                <div>Settings</div>
              </a>
            </DropdownMenu.Item>
          {/if}
          <DropdownMenu.Item>
            <a
              href="https://discord.gg/2QCFwyE9Yr"
              target="_blank"
              class="flex place-items-center gap-2 whitespace-nowrap"
            >
              <Question />
              <div>Support</div>
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            {#if data.session?.user}
              <button onclick={() => signOut()} class="flex size-full place-items-center gap-2 whitespace-nowrap">
                <SignOut />
                <div class="">Logout</div>
              </button>
            {:else}
              <button
                onclick={() => signIn('discord')}
                class="flex size-full place-items-center gap-2 whitespace-nowrap"
              >
                <SignIn />
                <div>Login</div>
              </button>
            {/if}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </header>
  <div class="container flex max-h-fit min-w-min grow overflow-auto py-2">
    <slot />
  </div>
</div>
<form
  class="ml-auto flex-1 sm:flex-initial"
  method="post"
  action="/?/search"
  use:enhance={handleSubmit}
  bind:this={formEl}
>
  <Command.Dialog label="Search" bind:open class="">
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
            <Command.Item onSelect={() => (open = false)}>
              <a href="/character/{character.id}" class="size-full">
                {character.name}
              </a>
            </Command.Item>
          {/each}
        {/if}
      </Command.Group>
      <Command.Separator />
      <Command.Group heading="Guilds">
        {#if guilds?.length}
          {#each guilds as guild (guild.id)}
            <Command.Item onSelect={() => (open = false)}>
              <a href="/company/{guild.id}" class="size-full">
                {guild.name}
              </a>
            </Command.Item>
          {/each}
        {/if}
      </Command.Group>
    </Command.List>
  </Command.Dialog>
</form>

{#snippet logo()}
  <a href="/" class="flex flex-nowrap items-center gap-2 text-lg font-semibold md:text-base">
    <ChartPieSlice class="h-6 w-6" />
    <span class="sr-only">NW Stats</span>
  </a>
{/snippet}
