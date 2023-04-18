<script lang="ts">
    import "../app.css";
    import { base } from "$app/paths";
    import { page } from "$app/stores";
    import { navigating } from "$app/stores";
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

    onMount(() => {
        themeChange(false);
    });
</script>

<div
    class=" container flex flex-col mx-auto gap-4 h-screen overflow-y-hidden no-scrollbar"
>
    <div class="navbar bg-base-100 sticky top-0 z-50 justify-between">
        <a href="/" class="btn btn-ghost capitalize text-xl"> NW Stats </a>
        <div class="flex">
            <a
                href="https://discord.gg/UQ3Q4SBqND"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-ghost relative"
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
                <!--                 <img
                    src="https://cdn.nwdb.info/static/images/brand/logo_transparent_48.png"
                    srcset="https://cdn.nwdb.info/static/images/brand/logo_transparent_48@2.png 2x"
                    alt="Logo"
                    width="50%"
                    height="50%"
                    class="absolute bottom-0 right-0"
                /> -->
            </a>
            <div class="divider divider-horizontal px-0 mx-0" />
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

    <slot><!-- optional fallback --></slot>
    <div
        class="flex place-content-center max-h-24 h-32 md:max-h-fit overflow-auto no-scrollbar"
    >
        <div
            class="stats stats-vertical md:stats-horizontal shadow h-fit mb-2 overflow-auto no-scrollbar grow"
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

<style>
    .dropdown {
        z-index: 50;
    }
</style>
