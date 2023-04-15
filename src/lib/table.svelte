<script lang="ts">
    export let table: LeaderboardItem[];
    import { page } from "$app/stores";
    import { leaderboardMap } from "./leaderboardmap";
    import type { LeaderboardType } from "./leaderboardmap";

    $: firstlevelcategory = $page.url.searchParams.get("firstlevelcategory");
    $: category = $page.url.searchParams.get("category");
    $: subcategory = $page.url.searchParams.get("subcategory");
    $: regions = $page.url.searchParams.get("regions");
    $: leaderboardid = $page.url.searchParams.get("leaderboardid");

    const leaderboardData: LeaderboardType = leaderboardMap;

    $: data = leaderboardData[firstlevelcategory!][category!][
        subcategory!
    ].find((item) => item.LeaderboardDefinitionId === leaderboardid)!;

    const pageSize = Math.ceil(table.length / 10);
    const pageSizeArray = Array.from({ length: pageSize }, (_, i) => i + 1);
    let currentPage = 1;
    let itemsPerPage = 10;

    const pageArrayIndex = Array(itemsPerPage).fill(0);
    for (let i = 0; i < pageArrayIndex.length; i++) {
        pageArrayIndex[i] = i;
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

    function secondsToTimeFormat(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    }
</script>

<div
    class="flex justify-center capitalize sticky top-16 z-50 bg-base-300 py-4 w-full"
>
    {!isNaN(Number(data.DisplayName))
        ? `${category}, ${data.DisplayName}`
        : data.DisplayName}
</div>
<table
    class="table table-zebra w-full table-compact md:table-normal table-fixed"
>
    <thead>
        <tr>
            <th>Rank</th>
            <th>{data.Value}</th>
            <th>Server</th>
        </tr>
    </thead>
    <tbody>
        {#each pageArrayIndex as i}
            {#if table[i]}
                <tr>
                    <td>{i + 1}</td>
                    <td
                        >{data.Value === "Time"
                            ? secondsToTimeFormat(table[i].value)
                            : table[i].value}</td
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
                on:click={(e) => handleClickEvent(e)}>{currentPage - 1}</button
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
                on:click={(e) => handleClickEvent(e)}>{pageSizeArray[1]}</button
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
                on:click={(e) => handleClickEvent(e)}>{pageSizeArray[2]}</button
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
                on:click={(e) => handleClickEvent(e)}>{currentPage + 1}</button
            >
        {:else if currentPage + 1 <= pageSizeArray[2]}
            <button
                class="btn btn-sm {currentPage === pageSizeArray[3]
                    ? 'btn-active'
                    : ''}"
                on:click={(e) => handleClickEvent(e)}>{pageSizeArray[3]}</button
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
            class="btn btn-sm {currentPage === pageSize ? 'btn-active' : ''}"
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
