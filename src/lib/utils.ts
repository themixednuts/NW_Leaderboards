export function replaceLynshineSrc(src?: string) {
  if (!src) return src
  const lowersrc = src.toLowerCase()
  const idx = src.indexOf('lyshine')
  if (src[idx - 1] === '/')
    return lowersrc
      .replaceAll('\\', '/')
      .replaceAll('/lyshineui/images', 'https://cdn.nwdb.info/db/images/live/v35')
      .replaceAll('scale="2"', '')
  return lowersrc
    .replaceAll('\\', '/')
    .replaceAll('lyshineui/images', 'https://cdn.nwdb.info/db/images/live/v35')
    .replaceAll('scale="2"', '')
}
export function appendPngToSrc(htmlString: string): string {
  // Use a regular expression to find and modify the src attribute
  const modifiedHtmlString = htmlString.replace(/(src="[^"]*")/g, (match, src) => {
    // Append ".png" to the src attribute
    return `${src.slice(0, -1)}.png"`
  })

  return modifiedHtmlString
}

export const categories = [
  ['all', 'ALL ITEMS'],
  ['weapons', 'WEAPONS'],
  ['tools', 'TOOLS'],
  ['apparel', 'APPAREL'],
  ['resources', 'RESOURCES'],
  ['utilities', 'CONSUMABLES'],
  ['ammo', 'AMMUNITION'],
  ['furnishings', 'HOUSE FURNISHINGS'],
] as const

export const categoryWeights = {
  furnishings: 0,
  ammo: 1,
  utilities: 2,
  resources: 3,
  apparel: 4,
  tools: 5,
  weapons: 6,
}
export function dbTableNamesQuery() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const formattedDate = thirtyDaysAgo.toISOString().slice(0, 19)
  return `SELECT name FROM sqlite_master WHERE type = 'table' AND name >= '${formattedDate}' AND NOT name = 'libsql_wasm_func_table' `
}

const valueToRomanCache: { [key: number]: string } = {
  0: '',
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
}

const numberArray = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]

const romanArray = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
export function GetRomanFromNumber(value: number): string {
  value = value || 0
  if (valueToRomanCache[value]) {
    return valueToRomanCache[value]
  }
  let convertedValue = ''
  let remainingValue = value
  for (let i = 0; i < numberArray.length; i++) {
    while (remainingValue >= numberArray[i]) {
      convertedValue += romanArray[i]
      remainingValue -= numberArray[i]
    }
  }
  valueToRomanCache[value] = convertedValue
  return convertedValue
}
export function ItemPerkScaling(scalingPerGearscore: string, gearScore: number, itemClass?: string) {
  const [base, extended] = scalingPerGearscore.split(',')
  const [limit, extraScaling] = extended.split(':')

  return 1 + +base * (Math.min(gearScore, +limit) - 100) + +extraScaling * Math.max(gearScore - +limit, 0)
}

export function MarketBrowserQuery(sort?: string) {
  const query = `
  -- EXPLAIN QUERY PLAN
  SELECT 
    itemKey,
    COALESCE (locale.text, master.Name) AS name,
    price,
    gearScore,
    master.ItemType AS itemType,
    quantity,
    contractType,
    rarity,
    queryDate,
    CAST(master.Tier AS INTEGER) AS tier,
    expirationSec,
    COALESCE(weapon.IconPath, instruments.IconPath, armor.IconPath, master.IconPath) AS iconPath,
    (SELECT json_group_array(
            	json_object(
            	'id', PerkID,
            	'iconPath', IconPath,
            	'type', PerkType,
            	'scaling', ScalingPerGearScore,
            	'affixes', (SELECT json_object(
                        				 'str', MODStrength,
                        				 'dex', MODDexterity,
                        				 'int', MODIntelligence,
                        				 'foc', MODFocus,
                        				 'con', MODConstitution
                        				 ) FROM "AffixStatDataTable" WHERE ',' || Affix || ',' LIKE '%,' || "AffixStatDataTable".StatusID || ',%')
                              	)
                                )
                            FROM ItemPerks
                            WHERE ',' || perks || ',' LIKE '%,' || ItemPerks.PerkID || ',%'
    ) AS perks
  FROM orders AS server
  LEFT JOIN MasterItemDefinitions AS master ON itemKey = master.ItemID COLLATE NOCASE
  LEFT JOIN ArmorAppearances AS armor ON armor.ItemID = master.ArmorAppearanceM COLLATE NOCASE
  LEFT JOIN WeaponAppearanceDefinitions AS weapon ON weapon.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
  LEFT JOIN InstrumentsAppearanceDefinitions AS instruments ON instruments.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
  LEFT JOIN locale_en_us AS locale ON SUBSTR(master.Name, 2) = locale.key COLLATE NOCASE
  WHERE (:category = 'all' OR :category = master.TradingCategory COLLATE NOCASE)
  AND (:family = 'all' OR :family = master.TradingFamily COLLATE NOCASE)
  AND (:group = 'all' OR :group = master.TradingGroup COLLATE NOCASE)
  AND server.contractType = :type
  AND server.server = :server
  AND server.sessionDate = (SELECT sessionDate FROM server_metadata WHERE server = :server)
  ${sort ? sort : ''}
  LIMIT 20 OFFSET (:page - 1) * 20;
  `
  return query
}

export function getLocalizedDate(timeStamp: string) {
  const date = new Date(timeStamp)
  const options: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    // second: '2-digit',
    timeZoneName: 'short',
  }
  return date.toLocaleString(undefined, options)
}

export const serverList = ['El Dorado', 'Castle of Steel', 'Nyx', 'Abaton', 'Lilith', 'Isabella', 'Delos', 'Valhalla'].sort()
