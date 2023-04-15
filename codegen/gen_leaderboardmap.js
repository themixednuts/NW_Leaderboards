import { readFile, writeFile } from 'fs/promises';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

const leaderboardTablePath = "C:/Users/jonfo/Documents/Github/themixednuts.github.io/static/sharedassests/springboardentitites/datatables/javelindata_leaderboard.json"
const leaderboardFile = await readFile(leaderboardTablePath, 'utf8')
const leaderboardJson = JSON.parse(leaderboardFile)

const localizationPath = "E:/Extract/NW PTR/localization/en-us/javelindata_leaderboards.loc.xml"
const localizationFile = await readFile(localizationPath, 'utf8')

const DOMParser = new JSDOM().window.DOMParser
const parser = new DOMParser()
const xmlDoc = parser.parseFromString(localizationFile, "application/xml")

function resolveKey(string) {
    const newString = string.replace("@", "")
    const key = xmlDoc.querySelector(`[key="${newString}"]`)
    return key.textContent
}


const leaderboardIdCount = new Map()

const obj = {}
for (const value of leaderboardJson) {
    const lbDefinitionId = value.LeaderboardDefinitionId
        .replace("min-dungeon-group-gold-medal-expedition-clear-time", "group_gold_time")
        .replace(/\-/g, "_")
        .replace(/\.\{.*\}/g, "")
        .replace(/\./g, "_")

    leaderboardIdCount.set(lbDefinitionId, (leaderboardIdCount.get(lbDefinitionId) || 0) + 1)

    if (!obj[value.FirstLevelCategory]) {
        obj[value.FirstLevelCategory] = {}
    }
    if (!obj[value.FirstLevelCategory][resolveKey(value.Category)]) {
        obj[value.FirstLevelCategory][resolveKey(value.Category)] = {}
    }

    if (!obj[value.FirstLevelCategory][resolveKey(value.Category)][resolveKey(value.SecondLevelCategory)]) {
        obj[value.FirstLevelCategory][resolveKey(value.Category)][resolveKey(value.SecondLevelCategory)] = []
    }

    const innerObj = {}

    innerObj["LeaderboardDefinitionId"] = lbDefinitionId
    innerObj["DisplayName"] = resolveKey(value.DisplayName)
    innerObj["Value"] = resolveKey(value.ValueString)
    innerObj["CharacterLeaderboard"] = value.CharacterLeaderboard
    innerObj["GroupLeaderboard"] = value.GroupLeaderboard
    innerObj["CompanyLeaderboard"] = value.CompanyLeaderboard
    innerObj["FactionLeaderboard"] = value.FactionLeaderboard

    if (!innerObj["EntitlementRewards"] && value.EntitlementRewards) {
        innerObj["EntitlementRewards"] = value.EntitlementRewards
    }
    if (!innerObj["Rewards"] && value.Rewards) {
        innerObj["Rewards"] = value.Rewards
    }
    if (!innerObj["CategoryDescription"] && value.CategoryDescription) {
        innerObj["CategoryDescription"] = resolveKey(value.CategoryDescription)
    }
    if (!innerObj["CategoryAdditionalHeader"] && value.CategoryAdditionalHeader) {
        innerObj["CategoryAdditionalHeader"] = resolveKey(value.CategoryAdditionalHeader)
    }

    if (!innerObj["Rotation"]) {
        innerObj["Rotation"] = []
    }
    if (!innerObj["Rotation"].includes(value.Rotation)) {
        innerObj["Rotation"].push(value.Rotation)
    }



    if (obj[value.FirstLevelCategory][resolveKey(value.Category)][resolveKey(value.SecondLevelCategory)].length === 0) {
        obj[value.FirstLevelCategory][resolveKey(value.Category)][resolveKey(value.SecondLevelCategory)].push(innerObj)
    } else {
        let shouldAddInnerObj = true;

        obj[value.FirstLevelCategory][resolveKey(value.Category)][resolveKey(value.SecondLevelCategory)].forEach(element => {
            if (element.LeaderboardDefinitionId === lbDefinitionId) {
                element["Rotation"].push(value.Rotation);
                shouldAddInnerObj = false;
            }
        });

        if (shouldAddInnerObj) {
            obj[value.FirstLevelCategory][resolveKey(value.Category)][resolveKey(value.SecondLevelCategory)].push(innerObj);
        }
    }

}

const writePath = "./src/lib/leaderboardmap.ts"
await writeFile(writePath, `export const leaderboardMap = ${JSON.stringify(obj, null, 4)}\n

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
}

export type LeaderboardType = typeof leaderboardMap & {
    [key: string]: {
        [key: string]: {
            [key: string]: LeaderboardDefinition[];
        };
    };
}`)