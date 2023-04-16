<script lang="ts">
    import "../app.css";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import type {
        LeaderboardDefinition,
        LeaderboardType,
    } from "$lib/leaderboardmap.js";
    import { leaderboardMap } from "$lib/leaderboardmap.js";
    import { base, assets } from "$app/paths";
    import { onMount } from "svelte";
    import { themeChange } from "theme-change";

    const leaderboardData: LeaderboardType = leaderboardMap;
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    console.log(prefersDark);
    $: firstLevelCategory = $page.url.searchParams.get("firstlevelcategory");
    $: category = $page.url.searchParams.get("category");
    $: subcategory = $page.url.searchParams.get("subcategory");
    $: regions = $page.url.searchParams.get("regions");
    $: leaderboardId = $page.url.searchParams.get("leaderboardid");

    let leaderboards: LeaderboardDefinition[] = [];
    $: if (
        firstLevelCategory &&
        subcategory &&
        category &&
        leaderboardData[firstLevelCategory!][category!]
    ) {
        leaderboards =
            leaderboardData[firstLevelCategory!][category!][subcategory!];
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
        firstlevelcategory: [
            "category",
            "subcategory",
            "regions",
            "leaderboardid",
        ],
        category: ["subcategory", "regions", "leaderboardid"],
        subcategory: ["regions", "leaderboardid"],
    };

    function updateSearchParams(param: string, id: string) {
        type Hierarchy = typeof hierarchy;
        const searchParams = new URLSearchParams($page.url.searchParams);

        if (hierarchy[param]) {
            hierarchy[param].forEach((key) => searchParams.delete(key));
        }

        if (
            param === "subcategory" &&
            leaderboardData[firstLevelCategory!][category!][id!].length === 1
        ) {
            searchParams.set(
                "leaderboardid",
                leaderboardData[firstLevelCategory!][category!][id!][0]
                    .LeaderboardDefinitionId
            );
        }
        searchParams.set(param, id);
        goto(`${$page.url.pathname}?${searchParams}`);
    }

    async function getUniqueUserData() {
        const response = await fetch(`https://lb.jakel.rocks/users`);

        if (response.status !== 200) {
            throw new Error("Unique users not found");
        }
        const data: LeaderboardAPIUserResponse = await response.json();

        return data;
    }

    onMount(() => {
        themeChange(false);
    });
</script>

<div
    class=" container flex flex-col mx-auto gap-4 h-screen overflow-y-hidden no-scrollbar"
>
    <div class="navbar bg-base-100 sticky top-0 z-50 justify-between">
        <a href={base} class="btn btn-ghost normal-case text-xl">
            New World Leaderboards
        </a>
        <div class="dropdown dropdown-end">
            <div tabindex="0" class="btn gap-1 btn-ghost">
                <span>Theme</span>
            </div>
            <div
                class="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-box max-h-96 overflow-y-auto shadow-2xl no-scrollbar justify-between p-4"
            >
                <div class="flex flex-col gap-2 min-w-fit w-36">
                    <button
                        class="btn outline-base-content"
                        data-set-theme=""
                        data-theme={prefersDark ? "dark" : "light"}
                    >
                        Default
                    </button>
                    <button
                        class="btn outline-base-content"
                        data-set-theme="light"
                        data-theme="light"
                    >
                        Light
                    </button>
                    <button
                        class="btn outline-base-content"
                        data-set-theme="dark"
                        data-theme="dark"
                    >
                        Dark
                    </button>
                    <button
                        class="btn outline-base-content"
                        data-set-theme="pastel"
                        data-theme="pastel"
                    >
                        Pastel
                    </button>
                    <button
                        class="btn outline-base-content"
                        data-set-theme="bumblebee"
                        data-theme="bumblebee"
                    >
                        Bumblebee
                    </button>
                    <button
                        class="btn outline-base-content"
                        data-set-theme="lofi"
                        data-theme="lofi"
                    >
                        Lofi
                    </button>
                    <button
                        class="btn outline-base-content"
                        data-set-theme="emerald"
                        data-theme="emerald"
                    >
                        Emerald
                    </button>
                    <button
                        class="btn outline-base-content"
                        data-set-theme="cupcake"
                        data-theme="cupcake"
                    >
                        Cupcake
                    </button>
                    <button
                        class="btn outline-base-content"
                        data-set-theme="halloween"
                        data-theme="halloween"
                    >
                        Halloween
                    </button>
                    <button
                        class="btn outline-base-content"
                        data-set-theme="black"
                        data-theme="black"
                    >
                        Black
                    </button>
                    <button
                        class="btn outline-base-content"
                        data-set-theme="autumn"
                        data-theme="autumn"
                    >
                        Autumn
                    </button>
                    <button
                        class="btn outline-base-content"
                        data-set-theme="coffee"
                        data-theme="coffee"
                    >
                        Coffee
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div
        class="flex flex-col align-middle grow bg-base-300 min-w-fit px-4 h-full overflow-y-auto rounded-box no-scrollbar z-20"
    >
        <div
            class="flex place-content-center h-56 w-full place-self-stretch mt-4 border-2 p-2 border-base-100 rounded-box"
        >
            <img
                src={`${assets}${
                    bannerMap[firstLevelCategory || "Mutated Expeditions"]
                }`}
                alt=""
                class="object-cover object-top border-2 border-base-100 rounded-box bg-black"
            />
        </div>
        <div
            class="flex place-content-center gap-0 place-items-center mt-4 sticky top-0 z-50 bg-base-300 py-2"
        >
            <div class="dropdown">
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label tabindex="0" class="btn btn-xs md:btn-sm m-1"
                    >{firstLevelCategory
                        ? firstLevelCategory
                        : "Main Section"}</label
                >
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <ul
                    tabindex="0"
                    class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 overflow-scroll no-scrollbar min-h-24 flex-nowrap"
                >
                    {#each Object.keys(leaderboardData) as categoryKeys}
                        <li>
                            <div
                                class=" {firstLevelCategory === categoryKeys
                                    ? 'active'
                                    : ''}"
                                on:click={() =>
                                    updateSearchParams(
                                        "firstlevelcategory",
                                        categoryKeys
                                    )}
                                on:keypress={() =>
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
                    <label tabindex="0" class="btn btn-xs md:btn-sm m-1"
                        >{category ? category : "Category"}</label
                    >
                    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                    <ul
                        tabindex="0"
                        class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 left-1/2 -translate-x-1/2 overflow-auto no-scrollbar min-h-24 flex-nowrap"
                    >
                        {#each Object.keys(leaderboardData[firstLevelCategory]) as categoryKeys}
                            <li>
                                <div
                                    class={category === categoryKeys
                                        ? "active"
                                        : ""}
                                    on:click={() =>
                                        updateSearchParams(
                                            "category",
                                            categoryKeys
                                        )}
                                    on:keypress={() =>
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
                    <label tabindex="0" class="btn btn-xs md:btn-sm"
                        >{subcategory ? subcategory : "Sub Category"}</label
                    >
                    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                    <ul
                        tabindex="0"
                        class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 overflow-auto no-scrollbar min-h-24 flex-nowrap {subcategory
                            ? 'left-1/2 -translate-x-1/2'
                            : 'dropdown-end'}"
                    >
                        {#each Object.keys(leaderboardData[firstLevelCategory][category]) as categoryKeys}
                            <li>
                                <div
                                    class={subcategory === categoryKeys
                                        ? "active"
                                        : ""}
                                    on:click={() =>
                                        updateSearchParams(
                                            "subcategory",
                                            categoryKeys
                                        )}
                                    on:keypress={() =>
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
            {#if firstLevelCategory && category && subcategory && leaderboards && leaderboards.length > 1}
                <div class="dropdown dropdown-end relative">
                    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                    <!-- svelte-ignore a11y-label-has-associated-control -->

                    <label tabindex="0" class="btn btn-xs md:btn-sm m-1">
                        <div class="flex flex-col">
                            {#if leaderboardId && leaderboards.find((item) => item.LeaderboardDefinitionId === leaderboardId)?.DisplayName === subcategory}
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
                            {:else if leaderboardId && leaderboards.find((item) => item.LeaderboardDefinitionId === leaderboardId)?.DisplayName !== subcategory}
                                {leaderboards.find(
                                    (item) =>
                                        item.LeaderboardDefinitionId ===
                                        leaderboardId
                                )?.DisplayName}
                            {:else}
                                Leaderboards
                            {/if}
                        </div>
                    </label>
                    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                    <ul
                        tabindex="0"
                        class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 dropdown-end overflow-auto no-scrollbar min-h-24 flex-nowrap"
                    >
                        {#each Object.values(leaderboards) as categoryKeys}
                            <li>
                                <div
                                    class={leaderboardId ===
                                    categoryKeys.LeaderboardDefinitionId
                                        ? "active"
                                        : ""}
                                    on:click={() =>
                                        updateSearchParams(
                                            "leaderboardid",
                                            categoryKeys.LeaderboardDefinitionId
                                        )}
                                    on:keypress={() =>
                                        updateSearchParams(
                                            "leaderboardid",
                                            categoryKeys.LeaderboardDefinitionId
                                        )}
                                >
                                    <div class="flex">
                                        {categoryKeys.DisplayName}
                                    </div>
                                    {#if categoryKeys.CharacterLeaderboard || categoryKeys.CompanyLeaderboard}
                                        <div
                                            class="tooltip px-0"
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
    {#await getUniqueUserData()}
        <div class="footer">
            <button class="btn btn-xs loading">Loading</button>
        </div>
    {:then uniqueUsers}
        <div class="stats btn btn-sm shadow h-fit mb-2">
            <div class="stat place-items-center">
                <div class="stat-title">Unique Players</div>
                <div class="stat-value text-secondary">
                    {uniqueUsers.data[0].count}
                </div>
                <!-- <div class="stat-desc text-secondary">↗︎ 40 (2%)</div> -->
            </div>
        </div>
    {/await}
</div>
