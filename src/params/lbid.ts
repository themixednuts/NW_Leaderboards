import { LEADERBOARD_ID_MAP } from "$lib/leaderboardmap";

export function match(lbid) {
    return lbid in LEADERBOARD_ID_MAP
}