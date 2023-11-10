// To parse this data:
//
//   import { Convert } from "./file";
//
//   const marketData = Convert.toMarketData(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface MarketData {
    contractType:         number;
    queryDate:            string;
    duration:             number;
    expiration:           string;
    expirationSec:        number;
    gearScore:            number;
    gemPerkCount:         number;
    iconPath:             string;
    itemKey:              string;
    itemType:             ItemType;
    location:             Location;
    name:                 string;
    perkCount:            number;
    perks:                Perk[];
    price:                number;
    quantity:             number;
    rarity:               number;
    tier:                 number;
    sessionDate:          string
}

export interface Perk {
    id:       string;
    iconPath: string,
    scaling:  string,
    type:     "Generated" | "Gem" | "Inherent",
    affixes:  Affixes | null
}

export interface Affixes {
    con: string,
    dex: string,
    foc: string,
    int: string,
    str: string
}

export enum DisplayCategory {
    Ammunition = "Ammunition",
    Apparel = "Apparel",
    CategoryData = "@CategoryData_",
    Consumables = "Consumables",
    HouseFurnishings = "House Furnishings",
    Resources = "Resources",
    Tools = "Tools",
    Weapons = "Weapons",
}

export enum DisplayFamily {
    Amulets = "Amulets",
    Arcana = "Arcana",
    AttributeBonusFoods = "Attribute Bonus Foods",
    Azoth = "Azoth",
    Bags = "Bags",
    Bait = "Bait",
    CategoryData = "@CategoryData_",
    Coatings = "Coatings",
    Components = "Components",
    CookingIngredients = "Cooking Ingredients",
    CookingRecipes = "Cooking Recipes",
    CraftMods = "Craft Mods",
    Decorations = "Decorations",
    DyeIngredients = "Dye Ingredients",
    Dyes = "Dyes",
    Earrings = "Earrings",
    Enhancements = "Enhancements",
    EventConsumables = "Event Consumables",
    Furniture = "Furniture",
    GatheringTools = "Gathering Tools",
    HeavyArmor = "Heavy Armor",
    Instruments = "Instruments",
    IronAmmunition = "Iron Ammunition",
    Kits = "Kits",
    LightArmor = "Light Armor",
    MagicalWeapons = "Magical Weapons",
    MediumArmor = "Medium Armor",
    Miscellaneous = "Miscellaneous",
    MusicSheets = "Music Sheets",
    OrichalcumAmmunition = "Orichalcum Ammunition",
    PotionReagents = "Potion Reagents",
    Potions = "Potions",
    RawResources = "Raw Resources",
    RecoveryFoods = "Recovery Foods",
    RefinedResources = "Refined Resources",
    Rings = "Rings",
    RuneglassComponents = "Runeglass Components",
    Schematics = "Schematics",
    Shields = "Shields",
    StarmetalAmmunition = "Starmetal Ammunition",
    SteelAmmunition = "Steel Ammunition",
    The1HandedWeapons = "1-Handed Weapons",
    The2HandedWeapons = "2-Handed Weapons",
    Tinctures = "Tinctures",
    TradeSkillBonusFoods = "Trade Skill Bonus Foods",
    Trophies = "Trophies",
}

export enum DisplayGroup {
    AdventurerSSatchel = "Adventurer's Satchel",
    AirArcana = "Air Arcana",
    AmberRuneglassGems = "Amber Runeglass Gems",
    AmethystRuneglassGems = "Amethyst Runeglass Gems",
    AncientCoating = "Ancient Coating",
    AngryEarthCoating = "Angry Earth Coating",
    Animals = "Animals",
    AquamarineRuneglassGems = "Aquamarine Runeglass Gems",
    Arcana = "Arcana",
    Armoring = "Armoring",
    Arrows = "Arrows",
    AttributeBonusFoods = "Attribute Bonus Foods",
    AttributeItems = "Attribute Items",
    AzothFlute = "Azoth Flute",
    BeastCoating = "Beast Coating",
    Beds = "Beds",
    Beeswax = "Beeswax",
    Berry = "Berry",
    BlightTincture = "Blight Tincture",
    BlueDyes = "Blue Dyes",
    Blunderbusses = "Blunderbusses",
    BooksAndPaper = "Books and Paper",
    Bows = "Bows",
    BrownDyes = "Brown Dyes",
    Cabinets = "Cabinets",
    CarnelianRuneglassGems = "Carnelian Runeglass Gems",
    Cartridges = "Cartridges",
    Chairs = "Chairs",
    Charcoal = "Charcoal",
    Chestwear = "Chestwear",
    Cloth = "Cloth",
    ColorPigments = "Color Pigments",
    CombatBuffs = "Combat Buffs",
    ConditionalModifiers = "Conditional Modifiers",
    ConstitutionFoods = "Constitution Foods",
    Consumables = "Consumables",
    CookingComponents = "Cooking Components",
    CorruptedCoating = "Corrupted Coating",
    CorruptionTincture = "Corruption Tincture",
    CraftedAmulets = "Crafted Amulets",
    CraftedEarrings = "Crafted Earrings",
    CraftedRings = "Crafted Rings",
    CraftingBuffs = "Crafting Buffs",
    CraftingComponents = "Crafting Components",
    CraftingPatterns = "Crafting Patterns",
    Curtains = "Curtains",
    CutGemstones = "Cut Gemstones",
    CyanDyes = "Cyan Dyes",
    DeathArcana = "Death Arcana",
    DefensePotions = "Defense Potions",
    DefensiveModifiers = "Defensive Modifiers",
    DexterityFoods = "Dexterity Foods",
    DiamondRuneglassGems = "Diamond Runeglass Gems",
    Dishware = "Dishware",
    DroppedAmulets = "Dropped Amulets",
    DroppedEarrings = "Dropped Earrings",
    DroppedRings = "Dropped Rings",
    Drums = "Drums",
    EarthArcana = "Earth Arcana",
    Egg = "Egg",
    EmeraldRuneglassGems = "Emerald Runeglass Gems",
    EmptyRuneglassCases = "Empty Runeglass Cases",
    EncumbrancePotions = "Encumbrance Potions",
    Engineering = "Engineering",
    Feathers = "Feathers",
    Fibers = "Fibers",
    FireArcana = "Fire Arcana",
    FireStaves = "Fire Staves",
    FishingPoles = "Fishing Poles",
    FishingSalvage = "Fishing Salvage",
    Flail = "Flail",
    FocusFoods = "Focus Foods",
    FocusPotions = "Focus Potions",
    Footwear = "Footwear",
    FreshwaterBait = "Freshwater Bait",
    Fruits = "Fruits",
    FurnishingSchematics = "Furnishing Schematics",
    GatheringBuffs = "Gathering Buffs",
    Gloves = "Gloves",
    Grains = "Grains",
    GrayDyes = "Gray Dyes",
    GreatAxes = "Great Axes",
    Greatswords = "Greatswords",
    GreenDyes = "Green Dyes",
    GroupName = "@_GroupName",
    Guitar = "Guitar",
    Gunpowder = "Gunpowder",
    Harvesting = "Harvesting",
    Hatchets = "Hatchets",
    Headwear = "Headwear",
    HealingPotions = "Healing Potions",
    HealthRecovery = "Health Recovery",
    Honey = "Honey",
    HumanCoating = "Human Coating",
    IceGauntlets = "Ice Gauntlets",
    Ingot = "Ingot",
    InstrumentsComponents = "Instruments Components",
    IntelligenceFoods = "Intelligence Foods",
    JasperRuneglassGems = "Jasper Runeglass Gems",
    Jewelcrafting = "Jewelcrafting",
    KiteShields = "Kite Shields",
    LargeFish = "Large Fish",
    Leather = "Leather",
    Legwear = "Legwear",
    LifeArcana = "Life Arcana",
    LifeStaves = "Life Staves",
    Lighting = "Lighting",
    Logging = "Logging",
    LoggingAxe = "Logging Axe",
    LostCoating = "Lost Coating",
    LuckConsumables = "Luck Consumables",
    MagentaDyes = "Magenta Dyes",
    MagicalReagents = "Magical Reagents",
    MalachiteRuneglassGems = "Malachite Runeglass Gems",
    ManaPotions = "Mana Potions",
    ManaRecovery = "Mana Recovery",
    Mandolin = "Mandolin",
    Meats = "Meats",
    MedicinalReagents = "Medicinal Reagents",
    MediumFish = "Medium Fish",
    Mining = "Mining",
    MoonstoneRuneglassGems = "Moonstone Runeglass Gems",
    Muskets = "Muskets",
    Nut = "Nut",
    OffensiveModifiers = "Offensive Modifiers",
    OffensiveReagents = "Offensive Reagents",
    Oil = "Oil",
    OnyxRuneglassGems = "Onyx Runeglass Gems",
    OpalRuneglassGems = "Opal Runeglass Gems",
    OrangeDyes = "Orange Dyes",
    Ores = "Ores",
    OtherBuffs = "Other Buffs",
    OtherLarge = "Other (Large)",
    OtherSmall = "Other (Small)",
    Paintings = "Paintings",
    Pickaxe = "Pickaxe",
    PreciousIngot = "Precious Ingot",
    PreciousOres = "Precious Ores",
    ProtectiveReagents = "Protective Reagents",
    PurpleDyes = "Purple Dyes",
    Rapiers = "Rapiers",
    RawGemstones = "Raw Gemstones",
    Rawhides = "Rawhides",
    Recipes = "Recipes",
    RedDyes = "Red Dyes",
    RefinedStone = "Refined Stone",
    RefinedWood = "Refined Wood",
    RefiningComponents = "Refining Components",
    RepairKits = "Repair Kits",
    RoundShields = "Round Shields",
    RubyRuneglassGems = "Ruby Runeglass Gems",
    Rugs = "Rugs",
    SaltwaterBait = "Saltwater Bait",
    SalvageScraps = "Salvage Scraps",
    SapphireRuneglassGems = "Sapphire Runeglass Gems",
    Seasonings = "Seasonings",
    Shelves = "Shelves",
    Sickle = "Sickle",
    Skinning = "Skinning",
    SkinningKnife = "Skinning Knife",
    SmallFish = "Small Fish",
    SoulArcana = "Soul Arcana",
    Spears = "Spears",
    Stones = "Stones",
    StorageChests = "Storage Chests",
    Stoves = "Stoves",
    StrengthFoods = "Strength Foods",
    SuspendedAzoth = "Suspended Azoth",
    Swords = "Swords",
    Tables = "Tables",
    TopazRuneglassGems = "Topaz Runeglass Gems",
    TowerShields = "Tower Shields",
    TrinketComponents = "Trinket Components",
    TurquoiseDyes = "Turquoise Dyes",
    UprightBass = "Upright Bass",
    UtilityModifiers = "Utility Modifiers",
    Vegetables = "Vegetables",
    Vegetation = "Vegetation",
    VoidGauntlets = "Void Gauntlets",
    WarHammers = "War Hammers",
    Water = "Water",
    WaterArcana = "Water Arcana",
    Weaponsmithing = "Weaponsmithing",
    Woods = "Woods",
    YellowDyes = "Yellow Dyes",
}

export enum DisplayRarity {
    FontColor45D1FfRareFont = "<font color=\"#45d1ff\">Rare</font>",
    FontColor7Bf2EUncommonFont = "<font color=\"# 7bf2e\">Uncommon</font>",
    FontColorCcccccCommonFont = "<font color=\"#cccccc\">Common</font>",
    FontColorFf16F7EpicFont = "<font color=\"#ff16f7\">Epic</font>",
    FontColorFf8717LegendaryFont = "<font color=\"#ff8717\">Legendary</font>",
}

export enum DisplayTier {
    Empty = "",
    I = "I",
    Ii = "II",
    Iii = "III",
    Iv = "IV",
    V = "V",
}

export enum ItemType {
    Ammo = "Ammo",
    Armor = "Armor",
    Consumable = "Consumable",
    Dye = "Dye",
    HousingItem = "HousingItem",
    Resource = "Resource",
    Weapon = "Weapon",
}

export enum ItemTypeDisplayName {
    Ammo = "Ammo",
    Amulet = "Amulet",
    Bag = "Bag",
    Bait = "Bait",
    Blunderbuss = "Blunderbuss",
    Bow = "Bow",
    Consumable = "Consumable",
    Dye = "Dye",
    Earring = "Earring",
    Empty = "",
    EventKey = "Event Key",
    FireStaff = "Fire Staff",
    Flail = "Flail",
    Furniture = "Furniture",
    GreatAxe = "Great Axe",
    Greatsword = "Greatsword",
    Hatchet = "Hatchet",
    HeavyChestwear = "Heavy Chestwear",
    HeavyFootwear = "Heavy Footwear",
    HeavyGlove = "Heavy Glove",
    HeavyHeadwear = "Heavy Headwear",
    HeavyLegwear = "Heavy Legwear",
    IceGauntlet = "Ice Gauntlet",
    Instrument = "Instrument",
    KiteShield = "Kite Shield",
    LifeStaff = "Life Staff",
    LightChestwear = "Light Chestwear",
    LightFootwear = "Light Footwear",
    LightGlove = "Light Glove",
    LightHeadwear = "Light Headwear",
    LightLegwear = "Light Legwear",
    MediumChestwear = "Medium Chestwear",
    MediumFootwear = "Medium Footwear",
    MediumGlove = "Medium Glove",
    MediumHeadwear = "Medium Headwear",
    MediumLegwear = "Medium Legwear",
    MountConsumable = "Mount Consumable",
    Musket = "Musket",
    QuestItem = "Quest Item",
    Rapier = "Rapier",
    Recipe = "Recipe",
    Resource = "Resource",
    Ring = "Ring",
    RoundShield = "Round Shield",
    Spear = "Spear",
    Sword = "Sword",
    Tool = "Tool",
    TowerShield = "Tower Shield",
    VoidGauntlet = "Void Gauntlet",
    WarHammer = "War Hammer",
}

export enum Location {
    Bastion = "Bastion",
    Brightwood = "Brightwood",
    BrimstoneSands = "Brimstone Sands",
    CutlassKeys = "Cutlass Keys",
    EbonscaleReach = "Ebonscale Reach",
    Edengrove = "Edengrove",
    Empty = "",
    Everfall = "Everfall",
    LastLight = "Last Light",
    MonarchSBluffs = "Monarch's Bluffs",
    Mountainhome = "Mountainhome",
    Mountainrise = "Mountainrise",
    Mourningdale = "Mourningdale",
    Reekwater = "Reekwater",
    RestlessShore = "Restless Shore",
    TabernaMercatus = "Taberna Mercatus",
    TheBullSEye = "The Bull's Eye",
    WardenSRise = "Warden's Rise",
    WeaverSFen = "Weaver's Fen",
    WikalaAlWaha = "Wikala al-Waha",
    Windsward = "Windsward",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toMarketData(json: string): MarketData[] {
        return cast(JSON.parse(json), a(r("MarketData")));
    }

    public static marketDataToJson(value: MarketData[]): string {
        return JSON.stringify(uncast(value, a(r("MarketData"))), null, 2);
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
    "MarketData": o([
        { json: "contractType", js: "contractType", typ: 0 },
        { json: "date", js: "date", typ: "" },
        { json: "displayAttributes", js: "displayAttributes", typ: "" },
        { json: "displayCategory", js: "displayCategory", typ: r("DisplayCategory") },
        { json: "displayContractPrice", js: "displayContractPrice", typ: "" },
        { json: "displayFamily", js: "displayFamily", typ: r("DisplayFamily") },
        { json: "displayGearScore", js: "displayGearScore", typ: "" },
        { json: "displayGroup", js: "displayGroup", typ: r("DisplayGroup") },
        { json: "displayPerks", js: "displayPerks", typ: "" },
        { json: "displayRarity", js: "displayRarity", typ: r("DisplayRarity") },
        { json: "displaySocket", js: "displaySocket", typ: "" },
        { json: "displayTier", js: "displayTier", typ: r("DisplayTier") },
        { json: "duration", js: "duration", typ: 0 },
        { json: "expiration", js: "expiration", typ: r("Expiration") },
        { json: "expirationSec", js: "expirationSec", typ: 0 },
        { json: "gearScore", js: "gearScore", typ: 0 },
        { json: "gemPerkCount", js: "gemPerkCount", typ: 0 },
        { json: "iconPath", js: "iconPath", typ: "" },
        { json: "itemKey", js: "itemKey", typ: "" },
        { json: "itemType", js: "itemType", typ: r("ItemType") },
        { json: "itemTypeDisplayName", js: "itemTypeDisplayName", typ: r("ItemTypeDisplayName") },
        { json: "levelRequirement", js: "levelRequirement", typ: u(undefined, 0) },
        { json: "location", js: "location", typ: r("Location") },
        { json: "name", js: "name", typ: "" },
        { json: "originTerritoryId", js: "originTerritoryId", typ: 0 },
        { json: "perkCount", js: "perkCount", typ: 0 },
        { json: "perks", js: "perks", typ: u(undefined, "") },
        { json: "price", js: "price", typ: 0 },
        { json: "quantity", js: "quantity", typ: 0 },
        { json: "rarity", js: "rarity", typ: 0 },
        { json: "tier", js: "tier", typ: 0 },
    ], false),
    "DisplayCategory": [
        "Ammunition",
        "Apparel",
        "@CategoryData_",
        "Consumables",
        "House Furnishings",
        "Resources",
        "Tools",
        "Weapons",
    ],
    "DisplayFamily": [
        "Amulets",
        "Arcana",
        "Attribute Bonus Foods",
        "Azoth",
        "Bags",
        "Bait",
        "@CategoryData_",
        "Coatings",
        "Components",
        "Cooking Ingredients",
        "Cooking Recipes",
        "Craft Mods",
        "Decorations",
        "Dye Ingredients",
        "Dyes",
        "Earrings",
        "Enhancements",
        "Event Consumables",
        "Furniture",
        "Gathering Tools",
        "Heavy Armor",
        "Instruments",
        "Iron Ammunition",
        "Kits",
        "Light Armor",
        "Magical Weapons",
        "Medium Armor",
        "Miscellaneous",
        "Music Sheets",
        "Orichalcum Ammunition",
        "Potion Reagents",
        "Potions",
        "Raw Resources",
        "Recovery Foods",
        "Refined Resources",
        "Rings",
        "Runeglass Components",
        "Schematics",
        "Shields",
        "Starmetal Ammunition",
        "Steel Ammunition",
        "1-Handed Weapons",
        "2-Handed Weapons",
        "Tinctures",
        "Trade Skill Bonus Foods",
        "Trophies",
    ],
    "DisplayGroup": [
        "Adventurer's Satchel",
        "Air Arcana",
        "Amber Runeglass Gems",
        "Amethyst Runeglass Gems",
        "Ancient Coating",
        "Angry Earth Coating",
        "Animals",
        "Aquamarine Runeglass Gems",
        "Arcana",
        "Armoring",
        "Arrows",
        "Attribute Bonus Foods",
        "Attribute Items",
        "Azoth Flute",
        "Beast Coating",
        "Beds",
        "Beeswax",
        "Berry",
        "Blight Tincture",
        "Blue Dyes",
        "Blunderbusses",
        "Books and Paper",
        "Bows",
        "Brown Dyes",
        "Cabinets",
        "Carnelian Runeglass Gems",
        "Cartridges",
        "Chairs",
        "Charcoal",
        "Chestwear",
        "Cloth",
        "Color Pigments",
        "Combat Buffs",
        "Conditional Modifiers",
        "Constitution Foods",
        "Consumables",
        "Cooking Components",
        "Corrupted Coating",
        "Corruption Tincture",
        "Crafted Amulets",
        "Crafted Earrings",
        "Crafted Rings",
        "Crafting Buffs",
        "Crafting Components",
        "Crafting Patterns",
        "Curtains",
        "Cut Gemstones",
        "Cyan Dyes",
        "Death Arcana",
        "Defense Potions",
        "Defensive Modifiers",
        "Dexterity Foods",
        "Diamond Runeglass Gems",
        "Dishware",
        "Dropped Amulets",
        "Dropped Earrings",
        "Dropped Rings",
        "Drums",
        "Earth Arcana",
        "Egg",
        "Emerald Runeglass Gems",
        "Empty Runeglass Cases",
        "Encumbrance Potions",
        "Engineering",
        "Feathers",
        "Fibers",
        "Fire Arcana",
        "Fire Staves",
        "Fishing Poles",
        "Fishing Salvage",
        "Flail",
        "Focus Foods",
        "Focus Potions",
        "Footwear",
        "Freshwater Bait",
        "Fruits",
        "Furnishing Schematics",
        "Gathering Buffs",
        "Gloves",
        "Grains",
        "Gray Dyes",
        "Great Axes",
        "Greatswords",
        "Green Dyes",
        "@_GroupName",
        "Guitar",
        "Gunpowder",
        "Harvesting",
        "Hatchets",
        "Headwear",
        "Healing Potions",
        "Health Recovery",
        "Honey",
        "Human Coating",
        "Ice Gauntlets",
        "Ingot",
        "Instruments Components",
        "Intelligence Foods",
        "Jasper Runeglass Gems",
        "Jewelcrafting",
        "Kite Shields",
        "Large Fish",
        "Leather",
        "Legwear",
        "Life Arcana",
        "Life Staves",
        "Lighting",
        "Logging",
        "Logging Axe",
        "Lost Coating",
        "Luck Consumables",
        "Magenta Dyes",
        "Magical Reagents",
        "Malachite Runeglass Gems",
        "Mana Potions",
        "Mana Recovery",
        "Mandolin",
        "Meats",
        "Medicinal Reagents",
        "Medium Fish",
        "Mining",
        "Moonstone Runeglass Gems",
        "Muskets",
        "Nut",
        "Offensive Modifiers",
        "Offensive Reagents",
        "Oil",
        "Onyx Runeglass Gems",
        "Opal Runeglass Gems",
        "Orange Dyes",
        "Ores",
        "Other Buffs",
        "Other (Large)",
        "Other (Small)",
        "Paintings",
        "Pickaxe",
        "Precious Ingot",
        "Precious Ores",
        "Protective Reagents",
        "Purple Dyes",
        "Rapiers",
        "Raw Gemstones",
        "Rawhides",
        "Recipes",
        "Red Dyes",
        "Refined Stone",
        "Refined Wood",
        "Refining Components",
        "Repair Kits",
        "Round Shields",
        "Ruby Runeglass Gems",
        "Rugs",
        "Saltwater Bait",
        "Salvage Scraps",
        "Sapphire Runeglass Gems",
        "Seasonings",
        "Shelves",
        "Sickle",
        "Skinning",
        "Skinning Knife",
        "Small Fish",
        "Soul Arcana",
        "Spears",
        "Stones",
        "Storage Chests",
        "Stoves",
        "Strength Foods",
        "Suspended Azoth",
        "Swords",
        "Tables",
        "Topaz Runeglass Gems",
        "Tower Shields",
        "Trinket Components",
        "Turquoise Dyes",
        "Upright Bass",
        "Utility Modifiers",
        "Vegetables",
        "Vegetation",
        "Void Gauntlets",
        "War Hammers",
        "Water",
        "Water Arcana",
        "Weaponsmithing",
        "Woods",
        "Yellow Dyes",
    ],
    "DisplayRarity": [
        "<font color=\"#45d1ff\">Rare</font>",
        "<font color=\"# 7bf2e\">Uncommon</font>",
        "<font color=\"#cccccc\">Common</font>",
        "<font color=\"#ff16f7\">Epic</font>",
        "<font color=\"#ff8717\">Legendary</font>",
    ],
    "DisplayTier": [
        "",
        "I",
        "II",
        "III",
        "IV",
        "V",
    ],
    "Expiration": [
        "10d",
        "10h",
        "10m",
        "11d",
        "11h",
        "11m",
        "12d",
        "12h",
        "12m",
        "13d",
        "13h",
        "13m",
        "13s",
        "14d",
        "14h",
        "14m",
        "15h",
        "15m",
        "16h",
        "16m",
        "17h",
        "17m",
        "18h",
        "18m",
        "18s",
        "19h",
        "19m",
        "1d",
        "1h",
        "1m",
        "20h",
        "20m",
        "21h",
        "21m",
        "21s",
        "22h",
        "22m",
        "23h",
        "23m",
        "24h",
        "24m",
        "25m",
        "26m",
        "27m",
        "28m",
        "29m",
        "2d",
        "2h",
        "2m",
        "30m",
        "31m",
        "32m",
        "33m",
        "34m",
        "35m",
        "36m",
        "37m",
        "38m",
        "39m",
        "3d",
        "3h",
        "3m",
        "40m",
        "40s",
        "41m",
        "42m",
        "42s",
        "43m",
        "44m",
        "45m",
        "45s",
        "46m",
        "47m",
        "48m",
        "49m",
        "4d",
        "4h",
        "4m",
        "50m",
        "51m",
        "51s",
        "52m",
        "53m",
        "54m",
        "55m",
        "56m",
        "57m",
        "58m",
        "58s",
        "59m",
        "5d",
        "5h",
        "5m",
        "60m",
        "6d",
        "6h",
        "6m",
        "7d",
        "7h",
        "7m",
        "8d",
        "8h",
        "8m",
        "9d",
        "9h",
        "9m",
    ],
    "ItemType": [
        "Ammo",
        "Armor",
        "Consumable",
        "Dye",
        "HousingItem",
        "Resource",
        "Weapon",
    ],
    "ItemTypeDisplayName": [
        "Ammo",
        "Amulet",
        "Bag",
        "Bait",
        "Blunderbuss",
        "Bow",
        "Consumable",
        "Dye",
        "Earring",
        "",
        "Event Key",
        "Fire Staff",
        "Flail",
        "Furniture",
        "Great Axe",
        "Greatsword",
        "Hatchet",
        "Heavy Chestwear",
        "Heavy Footwear",
        "Heavy Glove",
        "Heavy Headwear",
        "Heavy Legwear",
        "Ice Gauntlet",
        "Instrument",
        "Kite Shield",
        "Life Staff",
        "Light Chestwear",
        "Light Footwear",
        "Light Glove",
        "Light Headwear",
        "Light Legwear",
        "Medium Chestwear",
        "Medium Footwear",
        "Medium Glove",
        "Medium Headwear",
        "Medium Legwear",
        "Mount Consumable",
        "Musket",
        "Quest Item",
        "Rapier",
        "Recipe",
        "Resource",
        "Ring",
        "Round Shield",
        "Spear",
        "Sword",
        "Tool",
        "Tower Shield",
        "Void Gauntlet",
        "War Hammer",
    ],
    "Location": [
        "Bastion",
        "Brightwood",
        "Brimstone Sands",
        "Cutlass Keys",
        "Ebonscale Reach",
        "Edengrove",
        "",
        "Everfall",
        "Last Light",
        "Monarch's Bluffs",
        "Mountainhome",
        "Mountainrise",
        "Mourningdale",
        "Reekwater",
        "Restless Shore",
        "Taberna Mercatus",
        "The Bull's Eye",
        "Warden's Rise",
        "Weaver's Fen",
        "Wikala al-Waha",
        "Windsward",
    ],
};
