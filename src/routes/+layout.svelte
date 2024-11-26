<script lang="ts">
  import '../app.pcss'

  import { navigating, page } from '$app/stores'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { signIn, signOut } from '@auth/sveltekit/client'
  import * as Sheet from '@/shadcn/components/ui/sheet'
  import { Button } from '@/shadcn/components/ui/button'
  import * as DropdownMenu from '@/shadcn/components/ui/dropdown-menu'
  import { Toaster } from '@/shadcn/components/ui/sonner'
  import Command from '@/components/command.svelte'

  // types
  import type { Action } from 'svelte/action'
  import type { ActionData, PageData } from './$types.js'

  // icons
  import Search from 'lucide-svelte/icons/search'
  import CircleUser from 'lucide-svelte/icons/circle-user'
  import Menu from 'lucide-svelte/icons/menu'
  import { Gear, SignIn, SignOut, Question, ChartPieSlice } from 'phosphor-svelte'
  import { setContext, type Snippet } from 'svelte'
  import { writable } from 'svelte/store'

  interface Props {
    data: PageData
    form: ActionData
    children: Snippet
  }

  let { data, children }: Props = $props()

  let cmd = writable(false)
  setContext('cmd', cmd)

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
</script>

<svelte:head>
  <!-- <script async src="https://nwdb.info/embed.js"></script> -->
</svelte:head>

<Toaster position="top-right" closeButton />
<Command />

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
        onclick={() => {
          $cmd = true
        }}
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
            <a href="/support" class="flex place-items-center gap-2 whitespace-nowrap">
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
  <main class="container flex max-h-fit min-w-min grow overflow-auto p-2">
    {@render children()}
  </main>
  <!--
  <div class="sticky bottom-10 left-10 flex w-screen min-w-fit max-w-xl items-center">
    <SuperDebug
      data={{ leaderboards: $page.data.leaderboards.length, status: $page.status, navigating: $navigating }}
      promise
      display={dev}
      theme="vscode"
      collapsible
    />
  </div>
  -->
</div>

{#snippet logo()}
  <a href="/" class="flex flex-nowrap items-center gap-2 text-lg font-semibold md:text-base">
    <ChartPieSlice class="h-6 w-6" />
    <span class="sr-only">NW Stats</span>
  </a>
{/snippet}
