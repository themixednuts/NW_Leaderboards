<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let categories;
    export let leaderboardData;

    const dispatch = createEventDispatcher();

    function handleEvent() {
        dispatch("selectCategory", "category");
    }
</script>

{#if $categories.firstlevelcategory}
    <div class="flex relative">
        <div class="dropdown">
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label tabindex="0" class="btn btn-xs md:btn-sm m-1"
                >{$categories.category || "Category"}</label
            >
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <ul
                tabindex="0"
                class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 left-1/2 -translate-x-1/2 overflow-y-auto overflow-x-hidden min-h-24 flex-nowrap max-h-[35vh] small-scrollbar"
            >
                {#each Object.keys(leaderboardData[$categories.firstlevelcategory]) as categoryKeys}
                    <li>
                        <button
                            class=" text-start {$categories.category ===
                            categoryKeys
                                ? 'active'
                                : ''}"
                            on:pointerup={(e) => {
                                if (e.button !== 0) {
                                    return;
                                }
                                $categories.category = categoryKeys;
                                handleEvent();
                            }}
                        >
                            {categoryKeys}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
        <div
            class="w-[100%] h-[5%] bottom-0 absolute grow -z-10 {!$categories.category
                ? 'bg-accent'
                : ''}"
        />
    </div>
{/if}
