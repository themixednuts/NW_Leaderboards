<script lang="ts">
  import { goto, afterNavigate } from '$app/navigation'
  import type { PageData } from './$types'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'

  export let data: PageData

  afterNavigate(({ from }) => {
    if (from) {
      const previousPage = from.params?.season
      if (previousPage) {
        // goto(`/`);
      }
    }
  })
  onMount(() => {
    goto(`${$page.params.leaderboardId}/${data.currentSeason}`)
  })
</script>

<svelte:head>
  <title>Redirecting...</title>
</svelte:head>

<div class="loading btn-ghost btn">Loading</div>
