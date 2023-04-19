<script context="module" lang="ts">
    export let prefersDark = true;
    if (browser) {
        prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function changeTheme(theme: string) {
        window.document
            .querySelector("html")!
            .setAttribute("data-theme", theme);
    }
</script>

<script lang="ts">
    export let theme = "";

    import { browser } from "$app/environment";
</script>

<button
    class="btn outline-base-content"
    data-set-theme={theme}
    data-theme={theme ? theme : prefersDark ? "dark" : "light"}
    data-act-class="[&_svg]:visible"
    on:pointerup={(e) => {
        if (e.button === 0) changeTheme(theme);
    }}
>
    <div class="flex w-full gap-6">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-3 h-3 invisible"
        >
            <path
                d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
            />
        </svg>
        <span class="grow"
            >{theme
                ? theme.charAt(0).toUpperCase() + theme.slice(1)
                : "Default"}</span
        >
    </div>
</button>
