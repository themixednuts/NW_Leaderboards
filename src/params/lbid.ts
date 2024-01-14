import { LEADERBOARD_ID_MAP } from '$lib/leaderboard/leaderboardmap'

export function match(lbid): lbid is keyof typeof LEADERBOARD_ID_MAP {
  return lbid in LEADERBOARD_ID_MAP
}
