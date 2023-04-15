import type { LayoutLoad } from './$types';

export let ssr = false;
export let prerender = true

export const load = (async () => {
    return {};
}) satisfies LayoutLoad;