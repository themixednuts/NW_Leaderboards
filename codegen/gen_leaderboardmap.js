import { writeFile } from 'fs/promises'
import jsdom from 'jsdom'
import csvParser from 'csv-parser'
import { Readable } from 'stream'

const { JSDOM } = jsdom

const leaderboard_response = await fetch("https://raw.githubusercontent.com/new-world-tools/datasheets-csv/main/LeaderboardData/LeaderboardDataTable.csv")
const data = []
const stream = new Readable()
stream.push(await leaderboard_response.text())
stream.push(null)

stream.pipe(csvParser())
  .on('data', row => {
    const convertedRow = {};

    for (const key in row) {
      if (row.hasOwnProperty(key)) {
        const value = row[key];
        // Attempt to parse the value to a number
        const parsedNumber = parseFloat(value);

        // Check if the parsed value is a valid number
        if (!isNaN(parsedNumber)) {
          // If it's a number, use the parsed value
          convertedRow[key] = parsedNumber;
        } else if (value.toLowerCase() === 'true') {
          // Check if the value is 'true' (case-insensitive)
          convertedRow[key] = true;
        } else if (value.toLowerCase() === 'false') {
          // Check if the value is 'false' (case-insensitive)
          convertedRow[key] = false;
        } else if (value.toLowerCase() === 'null' || value.toLowerCase() === 'undefined') {
          // Check if the value is 'null' or 'undefined' (case-insensitive)
          convertedRow[key] = null;
        } else {
          // If none of the above conditions match, keep it as a string
          convertedRow[key] = value;
        }
      }
    }
    data.push(convertedRow)
  })
  .on('end', () => {
    console.log('csv parsed?: ', data)
  })

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

const LEADERBOARD_DATA = {}
const LEADERBOARD_ID_MAP = {}
// https://raw.githubusercontent.com/new-world-tools/datasheets-csv/main/LeaderboardData/LeaderboardDataTable.csv
for (const value of data) {

  const {
    FirstLevelCategory,
    SecondLevelCategory,
    Category,
    DisplayName,
    ValueString,
    CharacterLeaderboard,
    GroupLeaderboard,
    CompanyLeaderboard,
    FactionLeaderboard,
    EntitlementRewards,
    Rewards,
    CategoryDescription,
    CategoryAdditionalHeader,
    Rotation,
    LeaderboardDefinitionId,
  } = value

  const lbid = LeaderboardDefinitionId.replace(
    'min-dungeon-group-gold-medal-expedition-clear-time',
    'group_gold_time')
    .replace(/\-/g, '_')
    .replace(/\.\{.*\}/g, '')
    .replace(/\./g, '_')

  const category = addPNG(resolveKey(Category))

  leaderboardIdCount.set(lbid, (leaderboardIdCount.get(lbid) || 0) + 1)

  LEADERBOARD_DATA[FirstLevelCategory] ??= {}
  LEADERBOARD_DATA[FirstLevelCategory][category] ??= {}
  LEADERBOARD_DATA[FirstLevelCategory][category][resolveKey(SecondLevelCategory)] ??= []

  const innerObj = {}

  innerObj['LeaderboardDefinitionId'] = lbid
  innerObj['DisplayName'] = resolveKey(DisplayName)
  innerObj['Value'] = resolveKey(ValueString)
  innerObj['CharacterLeaderboard'] = CharacterLeaderboard
  innerObj['GroupLeaderboard'] = GroupLeaderboard
  innerObj['CompanyLeaderboard'] = CompanyLeaderboard
  innerObj['FactionLeaderboard'] = FactionLeaderboard
  innerObj['FirstLevelCategory'] = FirstLevelCategory
  innerObj['Category'] = category
  innerObj['SecondLevelCategory'] = resolveKey(SecondLevelCategory)

  LEADERBOARD_ID_MAP[lbid] = {
    FirstLevelCategory: FirstLevelCategory,
    Category: category,
    SecondLevelCategory: resolveKey(SecondLevelCategory),
  }

  if (!innerObj['EntitlementRewards'] && EntitlementRewards) {
    innerObj['EntitlementRewards'] = EntitlementRewards
  }
  if (!innerObj['Rewards'] && Rewards) {
    innerObj['Rewards'] = Rewards
  }
  if (!innerObj['CategoryDescription'] && CategoryDescription) {
    innerObj['CategoryDescription'] = resolveKey(CategoryDescription)
  }
  if (!innerObj['CategoryAdditionalHeader'] && CategoryAdditionalHeader) {
    innerObj['CategoryAdditionalHeader'] = resolveKey(
      CategoryAdditionalHeader
    )
  }

  if (!innerObj['Rotation']) {
    innerObj['Rotation'] = []
  }
  if (!innerObj['Rotation'].includes(Rotation)) {
    innerObj['Rotation'].push(Rotation)
  }

  if (
    LEADERBOARD_DATA[FirstLevelCategory][category][
      resolveKey(SecondLevelCategory)
    ].length === 0
  ) {
    LEADERBOARD_DATA[FirstLevelCategory][category][
      resolveKey(SecondLevelCategory)
    ].push(innerObj)
  } else {
    let shouldAddInnerObj = true

    LEADERBOARD_DATA[FirstLevelCategory][category][
      resolveKey(SecondLevelCategory)
    ].forEach((element) => {
      if (element.LeaderboardDefinitionId === lbid) {
        element['Rotation'].push(Rotation)
        shouldAddInnerObj = false
      }
    })

    if (shouldAddInnerObj) {
      const isNumber = Number(innerObj.DisplayName) !== NaN

      if (isNumber) {
        LEADERBOARD_DATA[FirstLevelCategory][category][resolveKey(SecondLevelCategory)].unshift(innerObj)
      } else {
        LEADERBOARD_DATA[FirstLevelCategory][category][resolveKey(SecondLevelCategory)].push(innerObj)
      }
    }
  }
}

const writePath = './src/lib/leaderboardmap.ts'
await writeFile(
  writePath,
  `export const LEADERBOARD_DATA = ${JSON.stringify(
    LEADERBOARD_DATA,
    null,
    4
  )} as const\n
export const LEADERBOARD_ID_MAP = ${JSON.stringify(LEADERBOARD_ID_MAP, null, 4)} as const\n
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
}\n`
)
