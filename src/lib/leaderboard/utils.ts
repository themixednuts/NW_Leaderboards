import { LEADERBOARD_DATA, type LeaderboardData } from "$lib/leaderboard/leaderboardmap"
import type { get_valid_seasons } from "$lib/server/db"

export const factionImagePaths = [
    '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_syndicate.png',
    '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_maruaders.png',
    '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_convenant.png',
] as const

export const bannerMap = {
    'Mutated Expeditions': '/lyshineui/images/leaderboards/leaderboard_cat_bg_expeditions.png',
    'Faction War': (currentIndex: number) => factionImagePaths[currentIndex],
    'Vs. Environment': '/lyshineui/images/leaderboards/leaderboard_cat_bg_environment.png',
    'Vs. Players': '/lyshineui/images/leaderboards/leaderboard_cat_bg_player.png',
    'Trade Skills': '/lyshineui/images/leaderboards/leaderboard_cat_bg_trade.png',
} as const

export type BannerMap = typeof bannerMap

export const currentImageBanner = (key: keyof BannerMap, idx: number) => {
    if (key === 'Faction War')
        return bannerMap[key](idx)
    return bannerMap[key]
}

export function seasons(seasons: Awaited<ReturnType<typeof get_valid_seasons>>) {
    return seasons.map(s => {
        const startsWithQ = s.startsWith('q')
        const splitString = s.split(/([0-9]+)/).join(' ').trim()

        const label = startsWithQ ? splitString.replace('q', 'Quarter') : splitString.replace('s', 'Season')

        return {
            id: s,
            label
        } as const
    }).reverse()
}

export function getBannerMapKey(str: string) {
    for (const key of Object.keys(bannerMap) as (keyof typeof bannerMap)[]) {
        if (key.toLowerCase().replaceAll(' ', '').replaceAll('.', '') === str.toLowerCase()) return key
    }
}
