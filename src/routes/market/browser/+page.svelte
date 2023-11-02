<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;

</script>

<div class="join join-vertical">
    {#each data.servers as server }
        <a href="/market/browser/{server}/buy/all/1" class="join-item">{server}</a>
    {/each}
</div>