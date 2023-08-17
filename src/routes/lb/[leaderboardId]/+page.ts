import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ params, parent }) => {
    throw redirect(301, `/lb/${params.leaderboardId}/${(await parent()).currentSeason}`);
    return {};
}) satisfies LayoutLoad;