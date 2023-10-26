<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    const servers = ['El Dorado', 'Castle of Steel', 'Nyx', 'Abaton', 'Lilith', 'Isabella', 'Delos', 'Valhalla'].sort()
</script>

<div class="flex flex-col">
    {#each servers as server }
        <a href="/market/{server.toLowerCase().replaceAll(' ', '')}/browser/buy/all/1">{server}</a>
    {/each}

</div>