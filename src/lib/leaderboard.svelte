<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { PageData } from "../routes/$types";
    import { goto } from "$app/navigation";

    export let categories;
    export let leaderboardData;
    export let data: PageData;
    export let leaderboardId;
    export let leaderboards;
    export let leaderboardIdMap;

    const dispatch = createEventDispatcher();

    function handleEvent() {
        dispatch("selectCategory", "secondlevelcategory");
    }
</script>

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
                            {leaderboardData[$categories.firstlevelcategory][
                                $categories.category
                            ][$categories.subcategory][0].DisplayName}
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
                                    `/lb/${categoryKeys.LeaderboardDefinitionId}/${data.currentSeason}`
                                );
                            }}
                        >
                            <div class="flex">
                                {categoryKeys.DisplayName}
                            </div>
                            {#if categoryKeys.CharacterLeaderboard || categoryKeys.CompanyLeaderboard}
                                <div
                                    class="tooltip tooltip-info px-0 {i == 0
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
            ]?.Category === $categories.category &&
            leaderboardIdMap[leaderboardId].SecondLevelCategory ===
                $categories.subcategory
                ? 'bg-accent'
                : ''} "
        />
    </div>
{/if}
