import { readFile, writeFile } from 'fs/promises'
import jsdom from 'jsdom'

const { JSDOM } = jsdom

const leaderboardTablePath =
  'C:/Users/jonfo/Documents/Github/themixednuts.github.io/static/sharedassests/springboardentitites/datatables/javelindata_leaderboard.json'
const leaderboardFile = await readFile(leaderboardTablePath, 'utf8')
const leaderboardJson = JSON.parse(leaderboardFile)

const localizationPath =
  'E:/Extract/NW PTR/localization/en-us/javelindata_leaderboards.loc.xml'
const localizationFile = await readFile(localizationPath, 'utf8')

const DOMParser = new JSDOM().window.DOMParser
const parser = new DOMParser()
const xmlDoc = parser.parseFromString(localizationFile, 'application/xml')

function resolveKey(string) {
  const newString = string.replace('@', '')
  const key = xmlDoc.querySelector(`[key="${newString}"]`)
  return key.textContent
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

  if (!leaderboardDataObj[value.FirstLevelCategory]) {
    leaderboardDataObj[value.FirstLevelCategory] = {}
  }
  if (
    !leaderboardDataObj[value.FirstLevelCategory][resolveKey(value.Category)]
  ) {
    leaderboardDataObj[value.FirstLevelCategory][resolveKey(value.Category)] =
      {}
  }

  if (
    !leaderboardDataObj[value.FirstLevelCategory][resolveKey(value.Category)][
      resolveKey(value.SecondLevelCategory)
    ]
  ) {
    leaderboardDataObj[value.FirstLevelCategory][resolveKey(value.Category)][
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
  innerObj['Category'] = resolveKey(value.Category)
  innerObj['SecondLevelCategory'] = resolveKey(value.SecondLevelCategory)

  leaderboardIdMap[lbDefinitionId] = {
    FirstLevelCategory: value.FirstLevelCategory,
    Category: resolveKey(value.Category),
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
    leaderboardDataObj[value.FirstLevelCategory][resolveKey(value.Category)][
      resolveKey(value.SecondLevelCategory)
    ].length === 0
  ) {
    leaderboardDataObj[value.FirstLevelCategory][resolveKey(value.Category)][
      resolveKey(value.SecondLevelCategory)
    ].push(innerObj)
  } else {
    let shouldAddInnerObj = true

    leaderboardDataObj[value.FirstLevelCategory][resolveKey(value.Category)][
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
        leaderboardDataObj[value.FirstLevelCategory][
          resolveKey(value.Category)
        ][resolveKey(value.SecondLevelCategory)].unshift(innerObj)
      } else {
        leaderboardDataObj[value.FirstLevelCategory][
          resolveKey(value.Category)
        ][resolveKey(value.SecondLevelCategory)].push(innerObj)
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
