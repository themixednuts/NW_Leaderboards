<script>
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  //remove once we have a proper page
  onMount(() => {
    goto('./lb')
  })
</script>

<svelte:head>
  <title>NW Stats - Leaderboards</title>
  <meta content="New World Global Leaderboards" property="og:title" />
  <meta
    content="A site to view leaderboards for New World"
    property="og:description"
  />
</svelte:head>

<button
  class="btn-ghost btn"
  on:pointerup={(e) => {
    if (e.button !== 0) {
      return
    }
    goto('./lb')
  }}
>
  Leaderboards
</button>
