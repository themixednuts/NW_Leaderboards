<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { PageData } from "../routes/$types";
    import { goto } from "$app/navigation";

    export let categories;
    export let leaderboardData;
    export let data: PageData;

    const dispatch = createEventDispatcher();

    function handleEvent() {
        dispatch("selectCategory", "secondlevelcategory");
    }
</script>

{#if $categories.firstlevelcategory && $categories.category}
    <div class="flex relative">
        <div class="dropdown dropdown-end">
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label tabindex="0" class="btn btn-xs md:btn-sm"
                >{$categories.subcategory || "Sub Category"}</label
            >
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <ul
                tabindex="0"
                class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 overflow-y-auto overflow-x-hidden min-h-24 flex-nowrap max-h-[35vh] small-scrollbar {$categories.subcategory
                    ? 'left-1/2 -translate-x-1/2'
                    : 'dropdown-end'}"
            >
                {#each Object.keys(leaderboardData[$categories.firstlevelcategory][$categories.category]) as categoryKeys}
                    <li>
                        <button
                            class=" text-left {$categories.subcategory ===
                            categoryKeys
                                ? 'active'
                                : ''}"
                            on:pointerup={(e) => {
                                if (e.button !== 0) {
                                    return;
                                }
                                $categories.subcategory = categoryKeys;
                                handleEvent();
                                if (
                                    leaderboardData[
                                        $categories.firstlevelcategory
                                    ][$categories.category][
                                        $categories.subcategory
                                    ].length === 1
                                ) {
                                    goto(
                                        `/lb/${
                                            leaderboardData[
                                                $categories.firstlevelcategory
                                            ][$categories.category][
                                                $categories.subcategory
                                            ][0].LeaderboardDefinitionId
                                        }/${data.currentSeason}`
                                    );
                                }
                            }}
                        >
                            {categoryKeys}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
        <div
            class="w-[100%] h-[5%] bottom-0 absolute grow {!$categories.subcategory ||
            ($categories.subcategory &&
                leaderboardData[$categories.firstlevelcategory][
                    $categories.category
                ][$categories.subcategory]?.length === 1)
                ? 'bg-accent'
                : ''}"
        />
    </div>
{/if}
