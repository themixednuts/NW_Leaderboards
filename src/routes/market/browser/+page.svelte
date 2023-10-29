<script lang="ts">
    import type { PageData } from './$types';
    import { serverList } from '$lib/utils';
    
    export let data: PageData;

</script>

<div class="join join-vertical">
    {#each serverList as server }
        <a href="/market/browser/{server.toLowerCase().replaceAll(' ', '')}/buy/all/1" class="join-item">{server}</a>
    {/each}
</div>