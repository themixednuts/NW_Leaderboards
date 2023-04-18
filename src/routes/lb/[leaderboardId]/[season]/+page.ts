import { goto } from '$app/navigation';
import type { PageLoad } from './$types';



export const load = (async ({ fetch, params }) => {
    const leaderboardId = params.leaderboardId;


    const seasonId = params.season


    const response = await fetch(
        `https://lb.jakel.rocks/json/${leaderboardId}/${seasonId}?size=1000`
    );

    if (response.status !== 200) {
        throw new Error("Leaderboard not found");
    }

    const json: LeaderboardAPIBoardResponse = await response.json();

    return {
        json: json.data,
        id: leaderboardId,
    } as const;

}) satisfies PageLoad;