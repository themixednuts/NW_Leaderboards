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
    import type { LayoutData } from "../$types";
    import Category from "$lib/category.svelte";
    import Firstcategory from "$lib/firstcategory.svelte";
    import Secondcategory from "$lib/secondcategory.svelte";
    import Leaderboard from "$lib/leaderboard.svelte";

    const leaderboardData: LeaderboardType = leaderboardMap;
    const leaderboardMapId: LeaderboardIdMap = leaderboardIdMap;
    const categories = writable({
        firstlevelcategory: "",
        category: "",
        subcategory: "",
    });

    export let data: LayoutData;

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

    $: if (!$categories.subcategory) {
        if (
            $categories.firstlevelcategory === "Mutated Expeditions" &&
            $categories.category
        ) {
            $categories.subcategory = "Clear Time";
            const leaderboardId =
                leaderboardData["Mutated Expeditions"][$categories.category][
                    $categories.subcategory
                ][9].LeaderboardDefinitionId;

            goto(`/lb/${leaderboardId}/${data.currentSeason}`);
        }

        if ($categories.firstlevelcategory === "Faction War") {
            if ($categories.category === "War") {
                $categories.subcategory = "Wins";
                const leaderboardId =
                    leaderboardData["Faction War"][$categories.category][
                        $categories.subcategory
                    ][0].LeaderboardDefinitionId;

                goto(`/lb/${leaderboardId}/${data.currentSeason}`);
            }

            if ($categories.category === "Territory Control") {
                $categories.subcategory = "Days Governed";
                const leaderboardId =
                    leaderboardData["Faction War"][$categories.category][
                        $categories.subcategory
                    ][0].LeaderboardDefinitionId;

                goto(`/lb/${leaderboardId}/${data.currentSeason}`);
            }
        }

        if ($categories.firstlevelcategory === "Vs. Environment") {
            if (
                $categories.category === "Invasions" ||
                $categories.category === "Corruption Breaches"
            ) {
                $categories.subcategory = "Score";
                const leaderboardId =
                    leaderboardData["Vs. Environment"][$categories.category][
                        $categories.subcategory
                    ][0].LeaderboardDefinitionId;

                goto(`/lb/${leaderboardId}/${data.currentSeason}`);
            }
        }

        if ($categories.firstlevelcategory === "Vs. Players") {
            if (
                $categories.category === "Outpost Rush" ||
                $categories.category === "3v3 Arenas"
            ) {
                $categories.subcategory = "Wins";
                const leaderboardId =
                    leaderboardData["Vs. Players"][$categories.category][
                        $categories.subcategory
                    ][0].LeaderboardDefinitionId;

                goto(`/lb/${leaderboardId}/${data.currentSeason}`);
            }

            if ($categories.category === "Open World PVP") {
                $categories.subcategory = "PvP Kills";
                const leaderboardId =
                    leaderboardData["Vs. Players"][$categories.category][
                        $categories.subcategory
                    ][0].LeaderboardDefinitionId;

                goto(`/lb/${leaderboardId}/${data.currentSeason}`);
            }
        }

        if ($categories.firstlevelcategory === "Trade Skills") {
            $categories.category = "Legendaries";
        }
    }

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
        : 'xl:place-content-center place-items-center'}"
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
        class=" place-items-center h-full hidden gap-2 grid-cols-3 grid-rows-3 row-span-full max-h-[29rem] col-span-full {!$categories.firstlevelcategory
            ? 'xl:grid'
            : 'xl:hidden'} place-content-center h-56 w-full mt-4 border-2 p-2 border-base-100 rounded-box"
    >
        {#each Object.keys(bannerMap) as banner, key}
            <div
                class="grid place-content-center {key === 0 || key === 1
                    ? 'place-content-start place-items-start'
                    : ''}  relative overflow-clip hover:bg-opacity-90 hover:border-accent hover:cursor-pointer h-full border-2 border-base-100 rounded-box bg-black {key ===
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
                    class="bg-opacity-0 absolute top-0 left-0 w-full h-full grid hover:bg-opacity-60 z-10 place-items-center bg-base-100 text-4xl"
                >
                    <div class="absolute bottom-4 left-4 text-white">
                        {banner}
                    </div>
                </div>
            </div>
        {/each}
    </div>
    <div
        class="flex row-span-1 col-span-full w-full {!$categories.firstlevelcategory
            ? 'xl:hidden'
            : 'xl:flex'} place-content-center gap-0 place-items-center mt-4 sticky top-0 z-50 bg-base-300 py-2"
    >
        <Firstcategory
            {categories}
            {leaderboardData}
            on:selectCategory={(e) => {
                removeFocus();
                clearHierarchy(e.detail);
            }}
        />

        <Category
            {categories}
            {leaderboardData}
            on:selectCategory={(e) => {
                removeFocus();
                clearHierarchy(e.detail);
            }}
        />

        <Secondcategory
            {categories}
            {leaderboardData}
            {data}
            on:selectCategory={(e) => {
                removeFocus();
                clearHierarchy(e.detail);
            }}
        />

        <Leaderboard
            {categories}
            {leaderboardData}
            {data}
            {leaderboardId}
            {leaderboards}
            {leaderboardIdMap}
            on:selectCategory={(e) => {
                removeFocus();
                clearHierarchy(e.detail);
            }}
        />
    </div>
    <slot />
</div>
