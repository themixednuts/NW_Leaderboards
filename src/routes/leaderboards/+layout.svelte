<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import type { LeaderboardType } from "$lib/leaderboardmap.js";
    import { leaderboardMap } from "$lib/leaderboardmap.js";

    export let data;
    $: firstLevelCategory = $page.url.searchParams.get("firstlevelcategory");
    $: category = $page.url.searchParams.get("category");
    $: subcategory = $page.url.searchParams.get("subcategory");
    $: regions = $page.url.searchParams.get("regions");
    $: leaderboardId = $page.url.searchParams.get("leaderboardid");

    const leaderboardData: LeaderboardType = leaderboardMap;

    $: if (firstLevelCategory !== null)
        console.log(leaderboardData[firstLevelCategory]);

    type BannerMap = {
        [key: string]: string;
    };

    const bannerMap: BannerMap = {
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
    };

    function updateSearchParams(param: string, id: string) {
        const searchParams = new URLSearchParams($page.url.searchParams);
        searchParams.forEach((value, key) => {
            if (param === "firstlevelcategory") {
                if (key !== "firstlevelcategory") {
                    searchParams.delete(key);
                }
            }
            if (param === "category") {
                if (key !== "category" && key !== "firstlevelcategory") {
                    searchParams.delete(key);
                }
            }
            if (param === "subcategory") {
                if (
                    key !== "subcategory" &&
                    key !== "category" &&
                    key !== "firstlevelcategory"
                ) {
                    searchParams.delete(key);
                }
            }
        });
        searchParams.set(param, id);
        goto(`${$page.url.pathname}?${searchParams}`);
    }

    $: console.log(firstLevelCategory, $page);
</script>

<div class="navbar bg-base-100 sticky top-0 z-50">
    <a href="./leaderboards" class="btn btn-ghost normal-case text-xl">
        New World Leaderboards
    </a>
</div>

<div
    class="flex flex-col grow gap-2 bg-base-300 min-w-fit px-4 h-full overflow-y-auto rounded-box no-scrollbar"
>
    <div
        class="flex justify-center w-full place-self-stretch h-56 min-h-56 mt-4 border-2 p-2 border-base-100 rounded-box"
    >
        <img
            src={bannerMap[firstLevelCategory || "mutated"]}
            alt=""
            class="object-cover border-2 border-base-100 min-h-full rounded-box"
        />
    </div>
    <div
        class="flex place-content-center gap-4 place-items-center mt-4 sticky top-0 z-50 bg-base-300 py-2"
    >
        <div class="dropdown">
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label tabindex="0" class="btn m-1"
                >{firstLevelCategory
                    ? firstLevelCategory
                    : "Main Section"}</label
            >
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <ul
                tabindex="0"
                class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
                {#each Object.keys(leaderboardData) as categoryKeys}
                    <li>
                        <div
                            class={firstLevelCategory === categoryKeys
                                ? "active"
                                : ""}
                            on:pointerdown={() =>
                                updateSearchParams(
                                    "firstlevelcategory",
                                    categoryKeys
                                )}
                        >
                            {categoryKeys}
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
        {#if firstLevelCategory}
            <div class="dropdown">
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label tabindex="0" class="btn m-1"
                    >{category ? category : "Category"}</label
                >
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <ul
                    tabindex="0"
                    class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 left-1/2 -translate-x-1/2"
                >
                    {#each Object.keys(leaderboardData[firstLevelCategory]) as categoryKeys}
                        <li>
                            <div
                                class={category === categoryKeys
                                    ? "active"
                                    : ""}
                                on:pointerdown={() =>
                                    updateSearchParams(
                                        "category",
                                        categoryKeys
                                    )}
                            >
                                {categoryKeys}
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}

        {#if firstLevelCategory && category}
            <div class="dropdown dropdown-end">
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label tabindex="0" class="btn"
                    >{subcategory ? subcategory : "Sub Category"}</label
                >
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <ul
                    tabindex="0"
                    class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 {subcategory
                        ? 'left-1/2 -translate-x-1/2'
                        : 'dropdown-end'}"
                >
                    {#each Object.keys(leaderboardData[firstLevelCategory][category]) as categoryKeys}
                        <li>
                            <div
                                class={subcategory === categoryKeys
                                    ? "active"
                                    : ""}
                                on:pointerdown={() =>
                                    updateSearchParams(
                                        "subcategory",
                                        categoryKeys
                                    )}
                            >
                                {categoryKeys}
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
        {#if firstLevelCategory && category && subcategory}
            <div class="dropdown dropdown-end">
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label tabindex="0" class="btn m-1"
                    >{leaderboardId
                        ? leaderboardData[firstLevelCategory][category][
                              subcategory
                          ].find((item) => {
                              return (
                                  item.LeaderboardDefinitionId === leaderboardId
                              );
                          })?.DisplayName
                        : "Leaderboards"}</label
                >
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <ul
                    tabindex="0"
                    class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 dropdown-end"
                >
                    {#each Object.values(leaderboardData[firstLevelCategory][category][subcategory]) as categoryKeys}
                        <li>
                            <div
                                class={leaderboardId ===
                                categoryKeys.LeaderboardDefinitionId
                                    ? "active"
                                    : ""}
                                on:pointerdown={() =>
                                    updateSearchParams(
                                        "leaderboardid",
                                        categoryKeys.LeaderboardDefinitionId
                                    )}
                            >
                                {categoryKeys.DisplayName}
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
    {#if firstLevelCategory && category && subcategory && leaderboardId}
        <div
            class="border-2 border-base-100 rounded-box p-2 my-2 sticky top-52 min-h-fit"
        >
            <slot />
        </div>
    {/if}
</div>

<style>
    .min-h-56 {
        min-height: 14rem;
    }
</style>
