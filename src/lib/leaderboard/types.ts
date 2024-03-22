// To parse this data:
//
//   import { Convert } from "./file";
//
//   const leaderboardData = Convert.toLeaderboardData(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface LeaderboardData {
    LeaderboardId:                  string;
    IsEnabled:                      boolean;
    Namespace:                      Namespace;
    Rotation:                       Rotation;
    LeaderboardDefinitionId:        string;
    FactionLeaderboardDefinitionId: null | string;
    DataSheetCategory:              DataSheetCategory;
    DataSheetLBScope:               DataSheetLBScope;
    CharacterLeaderboard:           boolean;
    GroupLeaderboard:               boolean;
    CompanyLeaderboard:             boolean;
    FactionLeaderboard:             boolean;
    GameMode:                       null | string;
    FirstLevelCategory:             FirstLevelCategory;
    SecondLevelCategory:            string;
    SecondLevelCategoryPriority:    number | null;
    DisplayName:                    number | string;
    DisplayNamePriority:            number | null;
    Category:                       string;
    CategoryPriority:               number | null;
    Faction:                        null;
    Rewards:                        null | string;
    ItemRewards:                    null;
    EntitlementRewards:             null | string;
    CategoryDescription:            null | string;
    CategoryAdditionalHeader:       null | string;
    RewardType:                     null | string;
    NameString:                     null;
    ValueString:                    ValueString;
}

export enum DataSheetCategory {
    DarknessBreaches = "Darkness Breaches",
    Expeditions = "Expeditions",
    Invasion = "Invasion",
    OpenWorldPVP = "Open World PVP",
    OutpostRush = "Outpost Rush",
    PVPArenas = "PVP Arenas",
    TerritoryControl = "Territory Control",
    Tradeskills = "Tradeskills",
    Trials = "Trials",
    War = "War",
}

export enum DataSheetLBScope {
    Regional = "Regional",
    World = "World",
}

export enum FirstLevelCategory {
    FactionWar = "Faction War",
    Hidden = "Hidden",
    Inactive = "Inactive",
    MutatedExpeditions = "Mutated Expeditions",
    TradeSkills = "Trade Skills",
    VsEnvironment = "Vs. Environment",
    VsPlayers = "Vs. Players",
}

export enum Namespace {
    PC = "pc",
}

export enum Rotation {
    Month = "Month",
    Season = "Season",
    Week = "Week",
}

export enum ValueString {
    Captured = "Captured",
    Caught = "Caught",
    Completed = "Completed",
    Contributed = "Contributed",
    Crafted = "Crafted",
    Damage = "Damage",
    Days = "Days",
    Heals = "Heals",
    Influence = "Influence",
    Kills = "Kills",
    Ratio = "Ratio",
    Score = "Score",
    Time = "Time",
    WINS = "Wins",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toLeaderboardData(json: string): LeaderboardData[] {
        return cast(JSON.parse(json), a(r("LeaderboardData")));
    }

    public static leaderboardDataToJson(value: LeaderboardData[]): string {
        return JSON.stringify(uncast(value, a(r("LeaderboardData"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "LeaderboardData": o([
        { json: "LeaderboardId", js: "LeaderboardId", typ: "" },
        { json: "IsEnabled", js: "IsEnabled", typ: true },
        { json: "Namespace", js: "Namespace", typ: r("Namespace") },
        { json: "Rotation", js: "Rotation", typ: r("Rotation") },
        { json: "LeaderboardDefinitionId", js: "LeaderboardDefinitionId", typ: "" },
        { json: "FactionLeaderboardDefinitionId", js: "FactionLeaderboardDefinitionId", typ: u(null, "") },
        { json: "DataSheetCategory", js: "DataSheetCategory", typ: r("DataSheetCategory") },
        { json: "DataSheetLBScope", js: "DataSheetLBScope", typ: r("DataSheetLBScope") },
        { json: "CharacterLeaderboard", js: "CharacterLeaderboard", typ: true },
        { json: "GroupLeaderboard", js: "GroupLeaderboard", typ: true },
        { json: "CompanyLeaderboard", js: "CompanyLeaderboard", typ: true },
        { json: "FactionLeaderboard", js: "FactionLeaderboard", typ: true },
        { json: "GameMode", js: "GameMode", typ: u(null, "") },
        { json: "FirstLevelCategory", js: "FirstLevelCategory", typ: r("FirstLevelCategory") },
        { json: "SecondLevelCategory", js: "SecondLevelCategory", typ: "" },
        { json: "SecondLevelCategoryPriority", js: "SecondLevelCategoryPriority", typ: u(0, null) },
        { json: "DisplayName", js: "DisplayName", typ: u(0, "") },
        { json: "DisplayNamePriority", js: "DisplayNamePriority", typ: u(0, null) },
        { json: "Category", js: "Category", typ: "" },
        { json: "CategoryPriority", js: "CategoryPriority", typ: u(0, null) },
        { json: "Faction", js: "Faction", typ: null },
        { json: "Rewards", js: "Rewards", typ: u(null, "") },
        { json: "ItemRewards", js: "ItemRewards", typ: null },
        { json: "EntitlementRewards", js: "EntitlementRewards", typ: u(null, "") },
        { json: "CategoryDescription", js: "CategoryDescription", typ: u(null, "") },
        { json: "CategoryAdditionalHeader", js: "CategoryAdditionalHeader", typ: u(null, "") },
        { json: "RewardType", js: "RewardType", typ: u(null, "") },
        { json: "NameString", js: "NameString", typ: null },
        { json: "ValueString", js: "ValueString", typ: r("ValueString") },
    ], false),
    "DataSheetCategory": [
        "Darkness Breaches",
        "Expeditions",
        "Invasion",
        "Open World PVP",
        "Outpost Rush",
        "PVP Arenas",
        "Territory Control",
        "Tradeskills",
        "Trials",
        "War",
    ],
    "DataSheetLBScope": [
        "Regional",
        "World",
    ],
    "FirstLevelCategory": [
        "Faction War",
        "Hidden",
        "Inactive",
        "Mutated Expeditions",
        "Trade Skills",
        "Vs. Environment",
        "Vs. Players",
    ],
    "Namespace": [
        "pc",
    ],
    "Rotation": [
        "Month",
        "Season",
        "Week",
    ],
    "ValueString": [
        "Captured",
        "Caught",
        "Completed",
        "Contributed",
        "Crafted",
        "Damage",
        "Days",
        "Heals",
        "Influence",
        "Kills",
        "Ratio",
        "Score",
        "Time",
        "Wins",
    ],
};
