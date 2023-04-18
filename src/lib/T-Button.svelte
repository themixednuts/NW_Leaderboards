<script lang="ts">
    export let theme: string;

    import { browser } from "$app/environment";

    let prefersDark: boolean = true;
    if (browser) {
        prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
</script>

<button
    class="btn outline-base-content"
    data-set-theme={theme}
    data-theme={theme ? theme : prefersDark ? "dark" : "light"}
    data-act-class="[&_svg]:visible"
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
