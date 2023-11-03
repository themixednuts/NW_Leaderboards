<script lang="ts">
  export let servers: string[]
  export let link: string

</script>

<div class="join join-vertical font-mono">
  {#each servers as server}
    <a href="{link.replaceAll('$server', server)}" class="join-item">{server}</a>
  {/each}
</div>
