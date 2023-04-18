<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    //remove once we have a proper page
    onMount(() => {
        goto("./lb");
    });
</script>

<button
    class="btn btn-ghost"
    on:pointerup={(e) => {
        if (e.button !== 0) {
            return;
        }
        goto("./lb");
    }}
>
    Leaderboards
</button>
