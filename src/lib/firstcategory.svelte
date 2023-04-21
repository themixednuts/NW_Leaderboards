<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let categories;
    export let leaderboardData;

    const dispatch = createEventDispatcher();

    function handleEvent() {
        dispatch("selectCategory", "firstlevelcategory");
    }
</script>

<div class="dropdown">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label tabindex="0" class="btn btn-xs md:btn-sm m-1"
        >{$categories.firstlevelcategory || "Main Section"}</label
    >
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <ul
        tabindex="0"
        class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 overflow-y-auto overflow-x-hidden min-h-24 flex-nowrap max-h-[35vh] small-scrollbar"
    >
        {#each Object.keys(leaderboardData) as categoryKeys}
            <li>
                <button
                    class=" {$categories.firstlevelcategory === categoryKeys
                        ? 'active'
                        : ''}"
                    on:pointerup={(e) => {
                        if (e.button !== 0) {
                            return;
                        }
                        $categories.firstlevelcategory = categoryKeys;
                        handleEvent();
                    }}
                >
                    {categoryKeys}
                </button>
            </li>
        {/each}
    </ul>
    <div
        class="w-[100%] h-[5%] bottom-0 absolute grow -z-10 {!$categories.firstlevelcategory
            ? 'bg-accent'
            : ''}"
    />
</div>
