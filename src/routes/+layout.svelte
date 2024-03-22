<script lang="ts">
  import '../app.css'
  import { navigating } from '$app/stores'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import type { Action } from 'svelte/action'
  import { Avatar, DropdownMenu, Button } from 'bits-ui'
  import { SignIn, SignOut } from '@auth/sveltekit/components'
  import { signOut } from '@auth/sveltekit/client'

  let { data } = $props()

  const progress = $state(tweened(0, { easing: cubicOut }))
  $effect(() => {
    if ($progress === 0.95) progress.set(0.99, { duration: 10000 })
  })

  const navigationProgress: Action<HTMLDivElement> = (ele: HTMLDivElement) => {
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
  <script async src="https://nwdb.info/embed.js"></script>
</svelte:head>

{#if !!$navigating}
  <div class="absolute left-0 top-0 z-[9999] h-1 bg-red-500" use:navigationProgress></div>
{/if}
<div class="container relative flex min-h-svh flex-col gap-2 pb-2">
  <div
    class="navbar sticky top-0 z-50 col-span-full row-span-1 row-start-1 min-w-fit justify-between whitespace-nowrap bg-base-100 shadow-lg"
  >
    <a href="/" class="font-sans text-2xl font-bold antialiased hover:link">NW STATS</a>

    <!-- <div class="breadcrumbs place-self-center text-sm">
      <ul>
        {#each routes as route, i (i)}
          {#if route}
            <li>
              <a href="/{routes.slice(1, i + 1).join('/')}" class="capitalize">
                {route}
              </a>
            </li>
          {/if}
        {/each}
      </ul>
    </div> -->
    <div class="flex">
      <a href="https://discord.gg/UQ3Q4SBqND" target="_blank" rel="noopener noreferrer" class="btn btn-ghost relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 127.14 96.36">
          <defs>
            <style>
              .cls-1 {
                fill: #5865f2;
              }
            </style>
          </defs>
          <g id="图层_2" data-name="图层 2">
            <g id="Discord_Logos" data-name="Discord Logos">
              <g id="Discord_Logo_-_Large_-_White" data-name="Discord Logo - Large - White">
                <path
                  class="cls-1"
                  d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
                />
              </g>
            </g>
          </g>
        </svg>
      </a>
    </div>
    {@render dropdown(data.session?.user)}
  </div>
  <div class="flex max-h-fit min-w-min grow overflow-auto px-2">
    <slot />
  </div>
</div>

{#snippet dropdown(user)}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      {@const action = builder.action}
      <button use:action {...builder}>
        {#if user}
          <Avatar.Root>
            <Avatar.Image class="size-10 rounded-full" src={user.image} alt="avatar" />
          </Avatar.Root>
        {:else}
          Log In
        {/if}
      </button>
      <!-- <Button builders={[builder]} variant="link" class="flex items-center justify-center rounded-full"></Button> -->
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="mt-1">
      <DropdownMenu.Group>
        <DropdownMenu.Label>{user?.name}</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <a href={'/profile'} class="h-full w-full">Profile</a>
        </DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>Characters</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <!-- {#await characters then characters}
                {#each characters as character}
                  <DropdownMenu.Item>
                    <a href="/profile/characters/{character.id}" class="h-full w-full">
                      {character.name}
                    </a>
                  </DropdownMenu.Item>
                {/each}
                {#if characters.length}
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item>
                    <a href={'/profile/characters'} class="h-full w-full">All</a>
                  </DropdownMenu.Item>
                {:else}
                  <DropdownMenu.Item>No Characters</DropdownMenu.Item>
                {/if}
              {/await} -->
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <!-- <DropdownMenu.Item>Settings</DropdownMenu.Item> -->
        <DropdownMenu.Item>
          Upload
          <!-- <a href={'/upload'} class="h-full w-full">Upload</a> -->
        </DropdownMenu.Item>
        <DropdownMenu.Separator />

        <DropdownMenu.Item>
          {#if user}
            <SignOut>Sign Out</SignOut>
          {:else}
            <SignIn provider="discord">Sign In</SignIn>
          {/if}
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{/snippet}
