<script lang="ts">
  import type { PageData } from './$types'
  import ServerList from '$lib/market/serverlist.svelte';

  export let data: PageData
</script>

<svelte:head>
  <title>NW Stats - Market</title>
  <meta content="New World Stats" property="og:title" />
  <meta content="Market Items - Servers" property="og:description" />
</svelte:head>

<ServerList servers={data.servers} />