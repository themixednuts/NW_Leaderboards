<script lang="ts">
  export let servers: string[]
</script>

<div class="join join-vertical font-mono">
  {#each servers as server}
    <a href="/market/items/{server}" class="join-item">{server}</a>
  {/each}
</div>
