<script lang="ts">
    import type { PageData } from './$types';
    import ServerList from '$lib/market/serverlist.svelte';
    
    export let data: PageData;

</script>

<ServerList servers={data.servers} link="/market/browser/$server/buy/all/1" />