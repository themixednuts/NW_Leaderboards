<script lang="ts">
    export let table: LeaderboardAPIBoardItem[];
    export let id: string;

    import { leaderboardMap, leaderboardIdMap } from "./leaderboardmap";
    import type { LeaderboardType, LeaderboardIdMap } from "./leaderboardmap";

    const leaderboardData: LeaderboardType = leaderboardMap;
    const leaderboardIdM: LeaderboardIdMap = leaderboardIdMap;

    const firstlevelcategory = leaderboardIdM[id].FirstLevelCategory;
    const category = leaderboardIdM[id].Category;
    const subcategory = leaderboardIdM[id].SecondLevelCategory;

    const pullDate = table[0].date;

    $: data = leaderboardData[firstlevelcategory][category][subcategory].find(
        (item) => item.LeaderboardDefinitionId === id
    );

    const pageSize = Math.ceil(table.length / 10);
    const pageSizeArray = Array.from({ length: pageSize }, (_, i) => i + 1);
    let currentPage = 1;
    let itemsPerPage = 10;

    const pageArrayIndex = Array(itemsPerPage).fill(0);
    for (let i = 0; i < pageArrayIndex.length; i++) {
        pageArrayIndex[i] = i;
    }

    const ranks = calculateRanks(table);

    function calculateRanks(data: LeaderboardAPIBoardItem[]) {
        let rank = 1;
        let currentRank = 1;
        let ranks = [];

        for (let i = 0; i < data.length; i++) {
            if (i !== 0 && data[i - 1].value !== data[i].value) {
                rank = currentRank;
            }
            ranks.push(rank);
            currentRank++;
        }

        return ranks;
    }

    function handleClickEvent(e: Event) {
        const target = e.target as HTMLButtonElement;
        currentPage = parseInt(target.innerText);
        displayPage(currentPage);
    }

    function displayPage(pageNumber: number) {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        for (let i = 0; i < itemsPerPage; i++) {
            const index = startIndex + i;
            if (index < table.length) {
                pageArrayIndex[i] = index;
            } else {
                pageArrayIndex[i] = null; // Set null if the index exceeds the array length
            }
        }
    }

    function secondsToTimeFormat(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    }

    function getDateAndTime(date: string) {
        const dateObject = new Date(date);
        const dateOptions = {
            year: "2-digit",
            month: "numeric",
            day: "numeric",
        } as const;

        const timeOptions = {
            hour: "numeric",
            minute: "numeric",
        } as const;
        return `${dateObject.toLocaleDateString(
            "en-US",
            dateOptions
        )} ${dateObject.toLocaleTimeString("en-US", timeOptions)}`;
    }
</script>

{#if data}
    <div
        class="flex justify-center capitalize sticky top-10 bg-base-300 py-4 w-full"
    >
        {!isNaN(Number(data.DisplayName))
            ? `${category}, ${data.DisplayName}`
            : data.DisplayName}
        {#if data.CategoryAdditionalHeader}
            <div
                class="tooltip tooltip-info"
                data-tip={data.CategoryAdditionalHeader.replace(/<[^>]*>/g, "")}
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
    <table
        class="table table-zebra w-full table-compact md:table-normal table-fixed overflow-clip"
    >
        <thead>
            <tr>
                <th scope="col">Rank</th>
                <th scope="col">{data.Value}</th>
                <th scope="col">Server</th>
            </tr>
        </thead>
        <tbody>
            {#each pageArrayIndex as i}
                {#if table[i]}
                    <tr>
                        <td>{ranks[i]}</td>
                        <td
                            >{data.Value === "Time"
                                ? secondsToTimeFormat(table[i].value)
                                : table[i].value.toLocaleString()}</td
                        >
                        <td>{table[i].server}</td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>

    <div class="flex justify-center btn-group place-self-center py-2 my-0">
        {#if pageSize > 5}
            <!-- Page 1 -->
            <button
                class="btn btn-sm {currentPage === pageSizeArray[0]
                    ? 'btn-active'
                    : ''}"
                on:click={(e) => handleClickEvent(e)}>{pageSizeArray[0]}</button
            >
            <!-- Page 2 or currentPage - 1 -->
            {#if currentPage - 1 > 2 && currentPage - 1 <= pageSize - 3}
                <button
                    class="btn btn-sm {currentPage === currentPage - 1
                        ? 'btn-active'
                        : ''}"
                    on:click={(e) => handleClickEvent(e)}
                    >{currentPage - 1}</button
                >
            {:else if currentPage - 1 >= pageSize - 3}
                <button
                    class="btn btn-sm {currentPage === pageSize - 3
                        ? 'btn-active'
                        : ''}"
                    on:click={(e) => handleClickEvent(e)}>{pageSize - 3}</button
                >
            {:else}
                <button
                    class="btn btn-sm {currentPage === pageSizeArray[1]
                        ? 'btn-active'
                        : ''}"
                    on:click={(e) => handleClickEvent(e)}
                    >{pageSizeArray[1]}</button
                >
            {/if}
            <!-- Page 3 or currentPage -->
            {#if currentPage > 3 && currentPage < pageSize - 1}
                <button
                    class="btn btn-sm {currentPage === currentPage
                        ? 'btn-active'
                        : ''}"
                    on:click={(e) => handleClickEvent(e)}>{currentPage}</button
                >
            {:else if currentPage >= 1 && currentPage < 4}
                <button
                    class="btn btn-sm {currentPage === pageSizeArray[2]
                        ? 'btn-active'
                        : ''}"
                    on:click={(e) => handleClickEvent(e)}
                    >{pageSizeArray[2]}</button
                >
            {:else}
                <button
                    class="btn btn-sm {currentPage === pageSize - 2
                        ? 'btn-active'
                        : ''}"
                    on:click={(e) => handleClickEvent(e)}>{pageSize - 2}</button
                >
            {/if}
            <!-- Page 4 or Page 5 or currentPage + 1 -->
            {#if currentPage + 1 < pageSize - 1 && currentPage + 1 > pageSizeArray[2]}
                <button
                    class="btn btn-sm {currentPage === currentPage + 1
                        ? 'btn-active'
                        : ''}"
                    on:click={(e) => handleClickEvent(e)}
                    >{currentPage + 1}</button
                >
            {:else if currentPage + 1 <= pageSizeArray[2]}
                <button
                    class="btn btn-sm {currentPage === pageSizeArray[3]
                        ? 'btn-active'
                        : ''}"
                    on:click={(e) => handleClickEvent(e)}
                    >{pageSizeArray[3]}</button
                >
            {:else}
                <button
                    class="btn btn-sm {currentPage === pageSize - 1
                        ? 'btn-active'
                        : ''}"
                    on:click={(e) => handleClickEvent(e)}>{pageSize - 1}</button
                >
            {/if}
            <!-- Page 6 or last page -->
            <button
                class="btn btn-sm {currentPage === pageSize
                    ? 'btn-active'
                    : ''}"
                on:click={(e) => handleClickEvent(e)}>{pageSize}</button
            >
        {:else}
            {#each pageSizeArray as i}
                <button
                    class="btn btn-sm {currentPage === i ? 'btn-active' : ''}"
                    on:click={(e) => handleClickEvent(e)}>{i}</button
                >
            {/each}
        {/if}
    </div>
    <div class="flex justify-center text-sm md:text-base">
        Date Pulled: {getDateAndTime(pullDate)}
    </div>
{:else}
    <div>No Table</div>
{/if}
