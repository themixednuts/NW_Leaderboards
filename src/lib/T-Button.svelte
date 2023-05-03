<script context="module" lang="ts">
  import { writable } from 'svelte/store'
  const currentTheme = writable('')
  let prefersDark = true

  if (browser) {
    prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  function changeTheme(theme: string) {
    localStorage.setItem('theme', theme)

    if (theme === '') {
      localStorage.removeItem('theme')
    }
    window.document.querySelector('html')!.setAttribute('data-theme', theme)
  }
</script>

<script lang="ts">
  import { browser } from '$app/environment'
  export let theme = ''

  if (browser) {
    $currentTheme = localStorage.getItem('theme') || ''
  }
</script>

<button
  class="btn outline-base-content"
  data-theme={theme ? theme : prefersDark ? 'dark' : 'light'}
  on:pointerup={(e) => {
    if (e.button === 0) {
      $currentTheme = theme
      changeTheme(theme)
    }
  }}
>
  <div class="flex w-full gap-6">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="h-3 w-3 {$currentTheme === theme ? 'visible' : 'invisible'}"
    >
      <path
        d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
      />
    </svg>
    <span class="grow">
      {theme ? theme.charAt(0).toUpperCase() + theme.slice(1) : 'Default'}
    </span>
  </div>
</button>
