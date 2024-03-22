import { LEADERBOARD_TYPE } from "$lib/leaderboard/utils"

export function match(type: 'group' | 'company' | 'character' | 'faction'): type is typeof type {
    return !!LEADERBOARD_TYPE[type]
}