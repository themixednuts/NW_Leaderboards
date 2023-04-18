<script lang="ts">
    import { assets } from "$app/paths";
    import { page } from "$app/stores";
    import { writable } from "svelte/store";
    import { goto } from "$app/navigation";
    import { leaderboardMap, leaderboardIdMap } from "$lib/leaderboardmap";
    import type {
        LeaderboardType,
        LeaderboardIdMap,
        LeaderboardDefinition,
    } from "$lib/leaderboardmap";

    const leaderboardData: LeaderboardType = leaderboardMap;
    const leaderboardMapId: LeaderboardIdMap = leaderboardIdMap;
    const categories = writable({
        firstlevelcategory: "",
        category: "",
        subcategory: "",
    });

    $: leaderboardId = $page.params.leaderboardId || "";

    $: if (leaderboardId) {
        $categories.firstlevelcategory =
            leaderboardMapId[leaderboardId].FirstLevelCategory;
        $categories.category = leaderboardMapId[leaderboardId].Category;
        $categories.subcategory =
            leaderboardMapId[leaderboardId].SecondLevelCategory;
    }

    let leaderboards: LeaderboardDefinition[] = [];

    $: if (
        $categories.firstlevelcategory &&
        $categories.category &&
        $categories.subcategory
    ) {
        leaderboards =
            leaderboardData[$categories.firstlevelcategory][
                $categories.category
            ][$categories.subcategory];
    }

    type BannerMap = {
        [key: string]: string;
    };

    const bannerMap: BannerMap & {
        "Mutated Expeditions": "/lyshineui/images/leaderboards/leaderboard_cat_bg_expeditions.png";
        "Faction War": "/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_convenant.png";
        "Vs. Environment": "/lyshineui/images/leaderboards/leaderboard_cat_bg_environment.png";
        "Vs. Players": "/lyshineui/images/leaderboards/leaderboard_cat_bg_player.png";
        "Trade Skills": "/lyshineui/images/leaderboards/leaderboard_cat_bg_trade.png";
    } = {
        "Mutated Expeditions":
            "/lyshineui/images/leaderboards/leaderboard_cat_bg_expeditions.png",
        "Faction War":
            "/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_convenant.png",
        "Vs. Environment":
            "/lyshineui/images/leaderboards/leaderboard_cat_bg_environment.png",
        "Vs. Players":
            "/lyshineui/images/leaderboards/leaderboard_cat_bg_player.png",
        "Trade Skills":
            "/lyshineui/images/leaderboards/leaderboard_cat_bg_trade.png",
    } as const;

    const hierarchy: { [key: string]: string[] } = {
        firstlevelcategory: ["category", "subcategory", "leaderboardId"],
        category: ["subcategory", "leaderboardId"],
        subcategory: ["leaderboardId"],
    };

    function clearHierarchy(targetKey: string) {
        if (hierarchy[targetKey]) {
            hierarchy[targetKey].forEach((item) => {
                $categories[item] = "";
            });
        }
    }

    function removeFocus() {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }
</script>

<div
    class="flex flex-col align-middle grow bg-base-300 min-w-fit px-4 h-full overflow-y-auto rounded-box no-scrollbar z-20 {$categories.firstlevelcategory
        ? ''
        : 'xl:place-content-center'}"
>
    <div
        class="flex row-span-1 col-span-full {$categories.firstlevelcategory
            ? 'xl:flex'
            : 'xl:hidden'} place-content-center h-56 w-full mt-4 border-2 p-2 border-base-100 rounded-box"
    >
        <img
            src={`${assets}${
                bannerMap[
                    $categories.firstlevelcategory || "Mutated Expeditions"
                ]
            }`}
            alt=""
            class="object-cover object-top border-2 border-base-100 rounded-box bg-black"
        />
    </div>
    <div
        class=" place-items-center h-min hidden gap-2 grid-cols-3 grid-rows-3 row-span-full col-span-full {!$categories.firstlevelcategory
            ? 'xl:grid'
            : 'xl:hidden'} place-content-center h-56 w-full mt-4 border-2 p-2 border-base-100 rounded-box"
    >
        {#each Object.keys(bannerMap) as banner, key}
            <div
                class="grid place-content-center relative overflow-clip hover:bg-opacity-90 hover:border-accent hover:cursor-pointer h-full border-2 border-base-100 rounded-box bg-black {key ===
                0
                    ? 'col-span-1 row-span-full'
                    : key === 1
                    ? 'col-span-1 row-span-full'
                    : 'col-span-1 row-span-1'}"
                on:pointerup={(e) => {
                    if (e.button !== 0) {
                        return;
                    }
                    clearHierarchy("firstlevelcategory");
                    $categories.firstlevelcategory = banner;
                }}
            >
                <img
                    src={`${assets}${bannerMap[banner]}`}
                    alt=""
                    title={banner}
                    class="h-full w-full"
                />
                <div
                    class="opacity-0 absolute top-0 left-0 w-full h-full grid hover:opacity-60 z-10 place-items-center bg-base-100 text-4xl"
                >
                    {banner}
                </div>
            </div>
        {/each}
    </div>
    <div
        class="flex row-span-1 col-span-full w-full {!$categories.firstlevelcategory
            ? 'xl:hidden'
            : 'xl:flex'} place-content-center gap-0 place-items-center mt-4 sticky top-0 z-50 bg-base-300 py-2"
    >
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
                            class=" {$categories.firstlevelcategory ===
                            categoryKeys
                                ? 'active'
                                : ''}"
                            on:pointerup={(e) => {
                                if (e.button !== 0) {
                                    return;
                                }
                                removeFocus();
                                clearHierarchy("firstlevelcategory");
                                $categories.firstlevelcategory = categoryKeys;
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
                                        removeFocus();
                                        clearHierarchy("category");
                                        $categories.category = categoryKeys;
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
                                    class={$categories.subcategory ===
                                    categoryKeys
                                        ? "active"
                                        : ""}
                                    on:pointerup={(e) => {
                                        if (e.button !== 0) {
                                            return;
                                        }
                                        removeFocus();
                                        clearHierarchy("subcategory");
                                        $categories.subcategory = categoryKeys;
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
                                                        $categories
                                                            .firstlevelcategory
                                                    ][$categories.category][
                                                        $categories.subcategory
                                                    ][0].LeaderboardDefinitionId
                                                }`
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
        {#if $categories.firstlevelcategory && $categories.category && $categories.subcategory && leaderboards && leaderboards.length > 1}
            <div class="relative flex place-content-center rounded-md">
                <div class="dropdown dropdown-end grow">
                    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                    <!-- svelte-ignore a11y-label-has-associated-control -->

                    <label tabindex="0" class="btn btn-xs md:btn-sm m-1">
                        <div class="flex flex-col">
                            {#if leaderboardId && leaderboards.find((item) => item.LeaderboardDefinitionId === leaderboardId)?.DisplayName === $categories.subcategory}
                                <div class="">
                                    {leaderboards.find(
                                        (item) =>
                                            item.LeaderboardDefinitionId ===
                                            leaderboardId
                                    )?.CharacterLeaderboard
                                        ? "Character"
                                        : leaderboards.find(
                                              (item) =>
                                                  item.LeaderboardDefinitionId ===
                                                  leaderboardId
                                          )?.CompanyLeaderboard
                                        ? "Company"
                                        : ""}
                                </div>
                            {:else if leaderboardId && leaderboards.find((item) => item.LeaderboardDefinitionId === leaderboardId)?.DisplayName !== $categories.subcategory}
                                {#if leaderboards.find((item) => item.LeaderboardDefinitionId === leaderboardId)}
                                    {leaderboards.find(
                                        (item) =>
                                            item.LeaderboardDefinitionId ===
                                            leaderboardId
                                    )?.DisplayName}
                                {:else}
                                    {leaderboardData[
                                        $categories.firstlevelcategory
                                    ][$categories.category][
                                        $categories.subcategory
                                    ][0].DisplayName}
                                {/if}
                            {:else}
                                Leaderboards
                            {/if}
                        </div>
                    </label>
                    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                    <ul
                        tabindex="0"
                        class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 dropdown-end overflow-y-auto overflow-x-hidden min-h-24 flex-nowrap max-h-[35vh] small-scrollbar"
                    >
                        {#each Object.values(leaderboards) as categoryKeys, i}
                            <li>
                                <button
                                    class={leaderboardId ===
                                    categoryKeys.LeaderboardDefinitionId
                                        ? "active"
                                        : ""}
                                    on:pointerup={(e) => {
                                        if (e.button !== 0) {
                                            return;
                                        }
                                        goto(
                                            `/lb/${categoryKeys.LeaderboardDefinitionId}`
                                        );
                                    }}
                                >
                                    <div class="flex">
                                        {categoryKeys.DisplayName}
                                    </div>
                                    {#if categoryKeys.CharacterLeaderboard || categoryKeys.CompanyLeaderboard}
                                        <div
                                            class="tooltip tooltip-info px-0 {i ==
                                            0
                                                ? 'tooltip-bottom'
                                                : ''}"
                                            data-tip={categoryKeys.CharacterLeaderboard
                                                ? "Character"
                                                : categoryKeys.CompanyLeaderboard
                                                ? "Company"
                                                : ""}
                                        >
                                            <!-- .replace(/(\<.*\>)/g, "") -->
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                class="w-4 h-4 stroke-current"
                                                ><path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                /></svg
                                            >
                                        </div>
                                    {/if}
                                </button>
                            </li>
                        {/each}
                    </ul>
                </div>
                <div
                    class="w-[100%] h-[5%] bottom-0 absolute grow -z-10 {leaderboardIdMap[
                        leaderboardId
                    ].Category === $categories.category &&
                    leaderboardIdMap[leaderboardId].SecondLevelCategory ===
                        $categories.subcategory
                        ? 'bg-accent'
                        : ''} "
                />
            </div>
        {/if}
    </div>
    <slot />
</div>
