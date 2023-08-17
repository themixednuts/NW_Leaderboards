import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
    return {
        currentSeason: (await parent()).currentSeason
    };
}) satisfies PageLoad;