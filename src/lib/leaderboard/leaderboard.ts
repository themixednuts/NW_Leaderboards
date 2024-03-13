import Papa from 'papaparse'
import { browser } from '$app/environment'

export interface LeaderboardData {
    LeaderboardId: string
    IsEnabled: boolean
    Namespace: string
    Rotation: string
    LeaderboardDefinitionId: string
    FactionLeaderboardDefinitionId: string
    DataSheetCategory: string
    DataSheetLBScope: string
    CharacterLeaderboard: boolean
    GroupLeaderboard: boolean
    CompanyLeaderboard: boolean
    FactionLeaderboard: boolean
    GameMode: string | null
    FirstLevelCategory: string
    SecondLevelCategory: string
    DisplayName: string
    Category: string
    Faction: null
    Rewards: string | null
    ItemRewards: null
    EntitlementRewards: string | null
    CategoryDescription: string | null
    RewardType: string | null
    NameString: string | null
    ValueString: string
}

export async function leaderboard_datatable() {
    const doc = await leaderboard_localization()
    const text = await fetch('https://raw.githubusercontent.com/new-world-tools/datasheets-csv/main/LeaderboardData/LeaderboardDataTable.csv').then(res => res.text())

    const { data } = Papa.parse(text, {
        dynamicTyping: true,
        skipEmptyLines: 'greedy',
        header: true,
        transform(value, field) {
            if (value.startsWith('@')) return add_png(resolve_key(value, doc))
            if (field === 'LeaderboardDefinitionId') return replace_gold_time(value)
            return value
        },
    })

    return data as LeaderboardData[]
}

export function find_leaderboard_by_secondcategory(leaderboard: LeaderboardData | undefined, secondcategory: string) {
    if (!leaderboard) return false
    return leaderboard.SecondLevelCategory.toLowerCase() === secondcategory.toLowerCase()
}

export function find_leaderboard_by_id(leaderboard: LeaderboardData | undefined, id: string) {
    if (!leaderboard) return false
    return leaderboard.LeaderboardId.toLowerCase() === id.toLowerCase()
}

export function find_leaderboard_by_filter(leaderboard: LeaderboardData | undefined, filter: string) {
    if (!leaderboard) return false
    for (const key of Object.keys(leaderboard) as (keyof LeaderboardData)[]) {
        if (key.toLowerCase() === filter.toLowerCase() + 'leaderboard') return leaderboard[key]
    }
}

export function find_leaderboard_by_id_secondcategory(leaderboard: LeaderboardData | undefined, id: string, category: string) {
    return find_leaderboard_by_id(leaderboard, id) && find_leaderboard_by_secondcategory(leaderboard, category)
}

export function find_leaderboard_by_id_secondcategory_filter(leaderboard: LeaderboardData | undefined, id: string, secondcategory: string, filter: string) {
    return find_leaderboard_by_id(leaderboard, id) && find_leaderboard_by_secondcategory(leaderboard, secondcategory) && find_leaderboard_by_filter(leaderboard, filter)
}
export function find_leaderboard_by_secondcategory_filter(leaderboard: LeaderboardData | undefined, secondcategory: string, filter: string) {
    return find_leaderboard_by_secondcategory(leaderboard, secondcategory) && find_leaderboard_by_filter(leaderboard, filter)
}

async function leaderboard_localization() {
    const text = await fetch('https://raw.githubusercontent.com/new-world-tools/localization/main/javelindata_leaderboards.loc.xml').then(res => res.text())

    if (!browser) {
        const { JSDOM } = await import('jsdom')
        const { DOMParser } = new JSDOM().window
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'application/xml')
        return doc
    } else {
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'application/xml')
        return doc
    }
}

function resolve_key(str: string, doc: Document) {
    const newString = str.replace('@', '')
    const key = doc.querySelector(`[key="${newString}"]`)
    return key?.textContent || str
}

function add_png(str: string) {
    const regex = /img.*?src="(.*?)".*?/i
    const matches = regex.exec(str)
    if (!matches) return str

    const srcAttributeValue = matches[1]
    const modifiedSrc = '/' + srcAttributeValue + '.png'
    const modifiedString = str.replace(srcAttributeValue, modifiedSrc)
    return modifiedString
}

function replace_gold_time(lbid: string) {
    return lbid.replace('min-dungeon-group-gold-medal-expedition-clear-time', 'group_gold_time')
        .replace(/\-/g, '_')
        .replace(/\.\{.*\}/g, '')
        .replace(/\./g, '_')
}

