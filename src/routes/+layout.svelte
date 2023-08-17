<script lang="ts">
  import '../app.css'
  import { onMount } from 'svelte'
  import Stats from '$lib/stats.svelte'
  import type { LayoutData } from './$types'
  import UserStats from '$lib/userStats.svelte'

  export let data: LayoutData

  const users = data.users
  const breaches = data.breaches.data[0]
  const legendaries = data.legendaries.data[0]

  onMount(() => {
    let prefersDark = true
    prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const defaultTheme =
      localStorage.getItem('theme') || prefersDark ? 'dark' : 'light'

    if (localStorage.getItem('theme')) {
      window.document
        .querySelector('html')
        ?.setAttribute('data-theme', localStorage.getItem('theme')!)
    } else {
      window.document
        .querySelector('html')
        ?.setAttribute('data-theme', defaultTheme)
    }
  })
</script>

<div
  class="container relative mx-auto grid h-screen grid-cols-1 grid-rows-[max-content,1fr,auto] place-content-center gap-2 overflow-y-auto overflow-x-hidden">
  <div
    class="navbar z-50 col-span-full row-span-1 row-start-1 h-full justify-between bg-base-100">
    <a href="/" class="font-sans text-2xl font-bold antialiased hover:link">
      NW STATS
    </a>
    <div class="flex">
      <a
        href="https://discord.gg/UQ3Q4SBqND"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-ghost relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 127.14 96.36">
          <defs>
            <style>
              .cls-1 {
                fill: #5865f2;
              }
            </style>
          </defs>
          <g id="图层_2" data-name="图层 2">
            <g id="Discord_Logos" data-name="Discord Logos">
              <g
                id="Discord_Logo_-_Large_-_White"
                data-name="Discord Logo - Large - White">
                <path
                  class="cls-1"
                  d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </g>
            </g>
          </g>
        </svg>
        <!--                 <img
                    src="https://cdn.nwdb.info/static/images/brand/logo_transparent_48.png"
                    srcset="https://cdn.nwdb.info/static/images/brand/logo_transparent_48@2.png 2x"
                    alt="Logo"
                    width="50%"
                    height="50%"
                    class="absolute bottom-0 right-0"
                /> -->
      </a>
      <!-- <div class="divider divider-horizontal mx-0 px-0" />
      <div class="dropdown dropdown-end">
        <div tabindex="0" class="btn-ghost btn gap-1">
          <span>Theme</span>
        </div>
        <div
          class="no-scrollbar dropdown-content rounded-box rounded-t-box max-h-96 justify-between overflow-y-auto bg-base-200 p-4 pl-2 text-base-content shadow-2xl">
          <div class="flex w-36 min-w-fit flex-col gap-2">
            <TButton theme="" />
            <TButton theme="light" />
            <TButton theme="dark" />
            <TButton theme="pastel" />
            <TButton theme="bumblebee" />
            <TButton theme="lofi" />
            <TButton theme="emerald" />
            <TButton theme="cupcake" />
            <TButton theme="halloween" />
            <TButton theme="black" />
            <TButton theme="autumn" />
            <TButton theme="coffee" />
          </div>
        </div>
      </div> -->
    </div>
  </div>

  <slot />

  <div
    class="hidden max-h-24 place-content-center place-items-center overflow-auto md:flex md:max-h-fit">
    <div
      class="stats stats-vertical mb-2 max-h-full grow overflow-auto shadow md:stats-horizontal">
      <UserStats json={users} />

      <Stats title="Legendaries Crafted" json={legendaries} />

      <Stats title="Corrupted Breach Participants" json={breaches} />
    </div>
  </div>
</div>
