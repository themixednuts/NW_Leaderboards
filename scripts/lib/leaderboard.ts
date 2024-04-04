import Papa from 'papaparse'
import { JSDOM } from 'jsdom'
import type { LeaderboardData } from '../../src/lib/leaderboard/types'

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


async function leaderboard_localization(link: string) {
  const text = await fetch(link).then(res => res.text())
  const { DOMParser } = new JSDOM().window
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'application/xml')
  return doc
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
