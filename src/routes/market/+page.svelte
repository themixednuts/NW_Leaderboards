<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;

    const marketRoutes = ['browser', 'item', 'stats']
</script>

<div class="flex flex-col">
    {#each marketRoutes as route}
        <a href="/market/{route}" class=" capitalize">{route}</a>
    {/each}

</div>
