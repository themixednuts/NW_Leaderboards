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
    import TButton from "$lib/T-Button.svelte";
    import {
        getUniqueUserData,
        getBreachesData,
        getLegendaryData,
        formatNumberToSI,
    } from "../utils";
    import Stats from "$lib/stats.svelte";

    const leaderboardData: LeaderboardType = leaderboardMap;
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

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

    console.log(base);
    onMount(() => {
        themeChange(false);
    });
</script>

<div
    class=" container flex flex-col mx-auto gap-4 h-screen overflow-y-hidden no-scrollbar"
>
    <div class="navbar bg-base-100 sticky top-0 z-50 justify-between">
        <a href="./" class="btn btn-ghost capitalize text-xl">
            new world leaderboards
        </a>
        <div class="flex">
            <a
                href="https://discord.gg/UQ3Q4SBqND"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-ghost"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 127.14 96.36"
                    ><defs
                        ><style>
                            .cls-1 {
                                fill: #5865f2;
                            }
                        </style></defs
                    ><g id="图层_2" data-name="图层 2"
                        ><g id="Discord_Logos" data-name="Discord Logos"
                            ><g
                                id="Discord_Logo_-_Large_-_White"
                                data-name="Discord Logo - Large - White"
                                ><path
                                    class="cls-1"
                                    d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
                                /></g
                            ></g
                        ></g
                    ></svg
                >
            </a>
            <div class="divider divider-horizontal" />
            <div class="dropdown dropdown-end">
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <div tabindex="0" class="btn gap-1 btn-ghost">
                    <span>Theme</span>
                </div>
                <div
                    class="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-box max-h-96 overflow-y-auto shadow-2xl no-scrollbar justify-between p-4 pl-2"
                >
                    <div class="flex flex-col gap-2 min-w-fit w-36">
                        <TButton theme="" />
                        <TButton theme="light" />
                        <TButton theme="dark" />
                        <TButton theme="pastel" />
                        <TButton theme="bumblebee" />
                        <TButton theme="lofi" />
                        <TButton theme="emerald" />
                        <TButton theme="cupcake" />
                        <TButton theme="halloween" />
                        <TButton theme="black" />
                        <TButton theme="autumn" />
                        <TButton theme="coffee" />
                    </div>
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
                <div class="dropdown dropdown-end">
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
                        class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 dropdown-end overflow-y-auto overflow-x-hidden min-h-24 flex-nowrap max-h-[35vh] small-scrollbar"
                    >
                        {#each Object.values(leaderboards) as categoryKeys, i}
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
    <div
        class="flex place-content-center max-h-24 h-32 md:max-h-fit overflow-auto no-scrollbar"
    >
        <div
            class="stats stats-vertical md:stats-horizontal shadow h-fit mb-2 overflow-auto no-scrollbar"
        >
            {#await getUniqueUserData()}
                <div class="stat place-items-center">
                    <button class="btn btn-xs loading">Loading</button>
                </div>
            {:then uniqueUsers}
                <Stats
                    title="Unique Characters"
                    value={uniqueUsers.data[0].count}
                />
            {/await}
            {#await getLegendaryData()}
                <div class="stat place-items-center">
                    <button class="btn btn-xs loading">Loading</button>
                </div>
            {:then legendaryData}
                <Stats
                    title="Legendaries Crafted"
                    value={legendaryData.data[0].count}
                />
            {/await}
            {#await getBreachesData()}
                <div class="stat place-items-center">
                    <button class="btn btn-xs loading">Loading</button>
                </div>
            {:then breachesData}
                <Stats
                    title="Corrupted Breaches Done"
                    value={breachesData.data[0].count}
                />
            {/await}
        </div>
    </div>
</div>
