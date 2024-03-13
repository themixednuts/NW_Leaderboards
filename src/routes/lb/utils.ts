import { LEADERBOARD_DATA, type LeaderboardData } from "$lib/leaderboard/leaderboardmap"

export const validSeasons = ['q1', 's1', 's2', 's3', 's4'] as const
export type ValidSeason = typeof validSeasons[number]

export const seasons = validSeasons.map(s => {
    const startsWithQ = s.startsWith('q')
    const splitString = s.split(/([0-9]+)/).join(' ').trim()

    const label = startsWithQ ? splitString.replace('q', 'Quarter') : splitString.replace('s', 'Season')

    return {
        id: s,
        label
    } as const
}).reverse()

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

export function getLeaderboardCategoryKeys<T extends keyof LeaderboardData>(firstCategory: T, category: string) {
    const obj = LEADERBOARD_DATA[firstCategory]
    return Object.keys(obj[category]) as (keyof LeaderboardData[T][typeof category])[]
}
