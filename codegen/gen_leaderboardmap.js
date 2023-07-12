import {  writeFile } from 'fs/promises'
import jsdom from 'jsdom'

const { JSDOM } = jsdom

const leadboardFetch = await fetch("https://raw.githubusercontent.com/new-world-tools/datasheets-json/main/LeaderboardData/LeaderboardDataTable.json")
const leaderboardJson = await leadboardFetch.json()

const localizationPath = await fetch("https://raw.githubusercontent.com/new-world-tools/localization/main/javelindata_leaderboards.loc.xml")
const localizationFile = await localizationPath.text()

const DOMParser = new JSDOM().window.DOMParser
const parser = new DOMParser()
const xmlDoc = parser.parseFromString(localizationFile, 'application/xml')

function resolveKey(string) {
  const newString = string.replace('@', '')
  const key = xmlDoc.querySelector(`[key="${newString}"]`)
  return key.textContent
}

function addPNG(string) {
  const regex = /img.*?src="(.*?)".*?/i;
  const matches = regex.exec(string);
  if (!matches) return string

  const srcAttributeValue = matches[1];

  // Append .png to the src attribute value
  const modifiedSrc = '/' + srcAttributeValue + '.png';
  const modifiedString = string.replace(srcAttributeValue, modifiedSrc);
  return modifiedString
} 

const leaderboardIdCount = new Map()

const leaderboardDataObj = {}
const leaderboardIdMap = {}

for (const value of leaderboardJson) {
  const lbDefinitionId = value.LeaderboardDefinitionId.replace(
    'min-dungeon-group-gold-medal-expedition-clear-time',
    'group_gold_time'
  )
    .replace(/\-/g, '_')
    .replace(/\.\{.*\}/g, '')
    .replace(/\./g, '_')

  leaderboardIdCount.set(
    lbDefinitionId,
    (leaderboardIdCount.get(lbDefinitionId) || 0) + 1
  )

  const category = addPNG(resolveKey(value.Category))
  if (!leaderboardDataObj[value.FirstLevelCategory]) {
    leaderboardDataObj[value.FirstLevelCategory] = {}
  }
  if (
    !leaderboardDataObj[value.FirstLevelCategory][category]
  ) {
    leaderboardDataObj[value.FirstLevelCategory][category] =
      {}
  }

  if (
    !leaderboardDataObj[value.FirstLevelCategory][category][
      resolveKey(value.SecondLevelCategory)
    ]
  ) {
    leaderboardDataObj[value.FirstLevelCategory][category][
      resolveKey(value.SecondLevelCategory)
    ] = []
  }

  const innerObj = {}

  innerObj['LeaderboardDefinitionId'] = lbDefinitionId
  innerObj['DisplayName'] = resolveKey(value.DisplayName)
  innerObj['Value'] = resolveKey(value.ValueString)
  innerObj['CharacterLeaderboard'] = value.CharacterLeaderboard
  innerObj['GroupLeaderboard'] = value.GroupLeaderboard
  innerObj['CompanyLeaderboard'] = value.CompanyLeaderboard
  innerObj['FactionLeaderboard'] = value.FactionLeaderboard
  innerObj['FirstLevelCategory'] = value.FirstLevelCategory
  innerObj['Category'] = category
  innerObj['SecondLevelCategory'] = resolveKey(value.SecondLevelCategory)

  leaderboardIdMap[lbDefinitionId] = {
    FirstLevelCategory: value.FirstLevelCategory,
    Category: category,
    SecondLevelCategory: resolveKey(value.SecondLevelCategory),
  }

  if (!innerObj['EntitlementRewards'] && value.EntitlementRewards) {
    innerObj['EntitlementRewards'] = value.EntitlementRewards
  }
  if (!innerObj['Rewards'] && value.Rewards) {
    innerObj['Rewards'] = value.Rewards
  }
  if (!innerObj['CategoryDescription'] && value.CategoryDescription) {
    innerObj['CategoryDescription'] = resolveKey(value.CategoryDescription)
  }
  if (!innerObj['CategoryAdditionalHeader'] && value.CategoryAdditionalHeader) {
    innerObj['CategoryAdditionalHeader'] = resolveKey(
      value.CategoryAdditionalHeader
    )
  }

  if (!innerObj['Rotation']) {
    innerObj['Rotation'] = []
  }
  if (!innerObj['Rotation'].includes(value.Rotation)) {
    innerObj['Rotation'].push(value.Rotation)
  }

  if (
    leaderboardDataObj[value.FirstLevelCategory][category][
      resolveKey(value.SecondLevelCategory)
    ].length === 0
  ) {
    leaderboardDataObj[value.FirstLevelCategory][category][
      resolveKey(value.SecondLevelCategory)
    ].push(innerObj)
  } else {
    let shouldAddInnerObj = true

    leaderboardDataObj[value.FirstLevelCategory][category][
      resolveKey(value.SecondLevelCategory)
    ].forEach((element) => {
      if (element.LeaderboardDefinitionId === lbDefinitionId) {
        element['Rotation'].push(value.Rotation)
        shouldAddInnerObj = false
      }
    })

    if (shouldAddInnerObj) {
      const isNumber = Number(innerObj.DisplayName) !== NaN

      if (isNumber) {
        leaderboardDataObj[value.FirstLevelCategory][category][resolveKey(value.SecondLevelCategory)].unshift(innerObj)
      } else {
        leaderboardDataObj[value.FirstLevelCategory][category][resolveKey(value.SecondLevelCategory)].push(innerObj)
      }
    }
  }
}

const writePath = './src/lib/leaderboardmap.ts'
await writeFile(
  writePath,
  `export const leaderboardMap = ${JSON.stringify(
    leaderboardDataObj,
    null,
    4
  )}\n
export const leaderboardIdMap = ${JSON.stringify(leaderboardIdMap, null, 4)}\n
export type LeaderboardDefinition = {
    Rotation: string[];
    Value: string;
    LeaderboardDefinitionId: string;
    DisplayName: string;
    EntitlementRewards?: string;
    Rewards?: string;
    CategoryDescription?: string;
    CategoryAdditionalHeader?: string;
    CharacterLeaderboard?: boolean;
    GroupLeaderboard?: boolean;
    CompanyLeaderboard?: boolean;
    FactionLeaderboard?: boolean;
    FirstLevelCategory?: string;
    Category?: string;
    SecondLevelCategory?: string;
}

export type LeaderboardType = typeof leaderboardMap & {
    [key: string]: {
        [key: string]: {
            [key: string]: LeaderboardDefinition[];
        };
    };
}

export type LeaderboardIdMap = typeof leaderboardIdMap & {
    [key: string]: {
        [key: string]: string
    }
}`
)
