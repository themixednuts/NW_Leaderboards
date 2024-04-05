import Papa from 'papaparse'
import { browser } from '$app/environment'
import type { get_valid_seasons } from "$lib/server/db/utils"
import type { LeaderboardData } from '$lib/leaderboard/types'

if (typeof Object.groupBy === typeof undefined) {
  Object.groupBy = (arr, callback) => {
    return arr.reduce((acc = {}, ...args) => {
      const key = callback(...args);
      acc[key] ??= []
      acc[key].push(args[0]);
      return acc;
    }, {})
  }
}

export const FACTION_IMAGE_PATHS = [
  '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_syndicate.png',
  '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_maruaders.png',
  '/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_convenant.png',
] as const

export const bannerMap = {
  'Mutated Expeditions': '/lyshineui/images/leaderboards/leaderboard_cat_bg_expeditions.png',
  'Faction War': (currentIndex: number) => FACTION_IMAGE_PATHS[currentIndex],
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

export function get_seasons(seasons: Awaited<ReturnType<typeof get_valid_seasons>>) {
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

export function get_rotations(seasons: Awaited<ReturnType<typeof get_valid_seasons>>) {
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
    if (normalize_string(key) === normalize_string(str)) return key
  }
  return 'Mutated Expeditions'
}
export interface LeaderboardAPIBoardItem {
  rank: number
  value: number
  server: string
  entityId?: string
  faction?: 'Faction1' | 'Faction2' | 'Faction3'
  // date: string
}

export enum LEADERBOARD_TYPE {
  character = 'CharacterLeaderboard',
  faction = 'FactionLeaderboard',
  company = 'CompanyLeaderboard',
  group = 'GroupLeaderboard'
}

export const GH_LEADERBOARD_URL = 'https://raw.githubusercontent.com/new-world-tools/datasheets-csv/main/LeaderboardData/LeaderboardDataTable.csv'
export const GH_LEADERBOARD_LOCALIZATION_URL = 'https://raw.githubusercontent.com/new-world-tools/localization/main/javelindata_leaderboards.loc.xml'
export const GH_OBJECTIVES_LOCALIZATION_URL = 'https://raw.githubusercontent.com/new-world-tools/localization/main/objectivesdungeons.loc.xml'

export async function leaderboard_datatable() {
  const [d1, d2] = await Promise.all([
    leaderboard_localization(GH_LEADERBOARD_LOCALIZATION_URL),
    leaderboard_localization(GH_OBJECTIVES_LOCALIZATION_URL),
  ])
  const text = fetch(GH_LEADERBOARD_URL).then(res => res.text())

  text.catch(e => console.log(e))

  const { data } = Papa.parse(await text, {
    dynamicTyping: true,
    skipEmptyLines: 'greedy',
    header: true,
    transform(value, field) {
      if (value.startsWith('@')) {
        if (resolve_key(value, d1) === value) return add_png(resolve_key(value, d2))
        return add_png(resolve_key(value, d1))
      }
      if (field === 'LeaderboardDefinitionId' || field === 'FactionLeaderboardDefinitionId') return normalize_leaderboard_id(value)
      return value
    },
  })

  return data as LeaderboardData[]
}

export type LeaderboardMatchOptions<T extends keyof LeaderboardData> = {
  [K in T]?: LeaderboardData[K] | Array<LeaderboardData[K]>
}

export function match_leaderboard<T extends keyof LeaderboardData>(leaderboard?: LeaderboardData, match?: LeaderboardMatchOptions<T>, strict: 'any' | 'all' = 'any'): boolean {
  if (!leaderboard) return false
  if (!match) {
    if (strict === 'all') return false
    return true
  }

  for (const key of Object.keys(match) as T[]) {
    const value = match[key]
    if (strict === 'any' && !value) continue

    if (Array.isArray(value)) {
      for (const v of value) {
        if (typeof v === 'string' && (normalize_leaderboard_string(leaderboard, key) !== normalize_string(v))) return false
        else if (typeof v !== 'string' && leaderboard[key] !== match[key]) return false
      }
    }
    else {
      if (typeof value === 'string' && (normalize_leaderboard_string(leaderboard, key) !== normalize_string(value))) return false
      else if (typeof value !== 'string' && leaderboard[key] !== match[key]) return false
    }
  }
  return true
}

export function leaderboard_by_type(leaderboard?: LeaderboardData, type?: string) {
  if (!leaderboard || !type) return false
  for (const key of Object.keys(leaderboard) as (keyof LeaderboardData)[]) {
    if (key.toLowerCase() === type.toLowerCase() + 'leaderboard') return leaderboard[key]
  }
}

export function leaderboard_group_by(leaderboards?: LeaderboardData[]): ([string, ([string, LeaderboardData[] | undefined])[] | undefined])[] | undefined {


  if (!leaderboards) return
  const g1 = Object.entries(Object.groupBy(leaderboards.sort(sort_leaderboards), ({ Category }) => Category))
  const g2 = g1.map(([str, lbs]) => [str, Object.entries(Object.groupBy(lbs!, ({ SecondLevelCategory }) => SecondLevelCategory))])
  return g2 as ([string, ([string, LeaderboardData[] | undefined])[] | undefined])[]
}

enum Rotation {
  Season,
  Month,
  Week
}

export function sort_leaderboards(a: LeaderboardData, b: LeaderboardData) {
  // Handle null values for CategoryPriority
  if (a.CategoryPriority === null && b.CategoryPriority !== null) {
    return 1 // Move a to a higher index since it has a null CategoryPriority
  }
  if (a.CategoryPriority !== null && b.CategoryPriority === null) {
    return -1 // Move a to a lower index since it has a null CategoryPriority
  }

  // Handle null values for DisplayNamePriority
  if (a.DisplayNamePriority === null && b.DisplayNamePriority !== null) {
    return 1 // Move a to a higher index since it has a null DisplayNamePriority
  }
  if (a.DisplayNamePriority !== null && b.DisplayNamePriority === null) {
    return -1 // Move a to a lower index since it has a null DisplayNamePriority
  }

  // Both CategoryPriority and DisplayNamePriority are not null
  if (a.CategoryPriority !== null && b.CategoryPriority !== null) {
    if (a.CategoryPriority !== b.CategoryPriority) {
      return a.CategoryPriority - b.CategoryPriority
    }
  }

  if (a.DisplayNamePriority !== null && b.DisplayNamePriority !== null) {
    if (a.DisplayNamePriority !== b.DisplayNamePriority) {
      return a.DisplayNamePriority - b.DisplayNamePriority
    }
  }

  // If both priorities are equal or null, sort by Rotation
  if (a.Rotation !== b.Rotation) {
    return Rotation[a.Rotation] - Rotation[b.Rotation]
  }

  // Handle the case where both CategoryPriority, DisplayNamePriority, and Rotation are equal
  return 0
}
async function leaderboard_localization(link: string) {
  const text = await fetch(link).then(res => res.text())
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

export function resolve_key(str: string, doc: Document) {
  const newString = str.replace('@', '')
  const key = doc.querySelector(`[key="${newString}"]`)
  return key?.textContent || str
}

export function add_png(str: string) {
  const regex = /img.*?src="(.*?)".*?/i
  const matches = regex.exec(str)
  if (!matches) return str

  const srcAttributeValue = matches[1]
  const modifiedSrc = '/' + srcAttributeValue + '.png'
  const modifiedString = str.replace(srcAttributeValue, modifiedSrc)
  return modifiedString
}

export function normalize_leaderboard_id(lbid: string) {
  return lbid.replace('min-dungeon-group-gold-medal-expedition-clear-time', 'group_gold_time')
    .replace(/\-/g, '_')
    // .replace(/\.\{.*\}/g, '')
    .replace(/\.\{.*?\}/g, (match) => match.replace(/\.\{[^}]*\}/g, ''))
    .replace(/\./g, '_')
}

export function normalize_leaderboard_string(leaderboard: LeaderboardData | undefined, field: keyof LeaderboardData) {
  if (!leaderboard) return
  const v = leaderboard[field]
  if (!v || typeof v !== 'string') return
  return normalize_string(v)
}

export function normalize_string(str: string) {
  return str.toLowerCase().replaceAll(' ', '').replaceAll('.', '').replaceAll("'", '').replaceAll('/', '').replace(/\<.*\>/g, '').trim()
}
