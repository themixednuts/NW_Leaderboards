<script>
  import { page } from '$app/stores'
</script>

{#if $page.error}
  <div class="place-self-center uppercase">{$page.error.message}</div>
{/if}
