<script lang="ts">
  import type { PageData } from './$types'
  import ServerList from '$lib/market/serverlist.svelte'

  export let data: PageData
</script>

{#await data.streamed.servers}
  <div class="loading loading-bars"></div>
{:then servers}
  <ServerList {servers} link="/market/browser/$server/buy/all/1" />
{/await}
