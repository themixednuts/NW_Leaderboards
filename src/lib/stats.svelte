<script lang="ts">
    export let title: string;
    export let value: string;
</script>

<div class="stat place-items-center shrink">
    <div class="stat-title text-sm md:text-base">{title}</div>
    <div class="stat-value text-secondary text-base md:text-4xl">
        {#if value}
            {Number(value).toLocaleString()}
        {:else}
            <span>No Data</span>
        {/if}
    </div>
    <!-- <div class="stat-desc text-secondary">↗︎ 40 (2%)</div> -->
</div>
