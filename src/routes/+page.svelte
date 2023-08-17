<script>
  import { page } from '$app/stores'
</script>

<svelte:head>
  <title>NW Stats - Leaderboards</title>
  <meta content="New World Global Leaderboards" property="og:title" />
  <meta
    content="A site to view leaderboards for New World"
    property="og:description" />
</svelte:head>

<a href="{$page.url.href}lb" class="btn-ghost btn">Leaderboards</a>
