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

export function MarketBrowserQuery(server: string, type: number, sort: string) {
  const query = `
SELECT 
    server.itemKey,
    COALESCE (master_locale.text, master.Name) AS name,
    server.price,
    server.gearScore,
    server.location,
    master.ItemType AS itemType,
    server.quantity,
    server.contractType,
    server.rarity,
    CAST(master.Tier AS INTEGER) AS tier,
    server.gemPerkCount,
    server.perkCount,
    server.duration,
    server.expiration,
    server.expirationSec,
    server.sessionDate,
    COALESCE(weapon.IconPath, instruments.IconPath, armor.IconPath, master.IconPath) AS iconPath,
    (
      SELECT json_group_array(
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
      WHERE ',' || server.perks || ',' LIKE '%,' || ItemPerks.PerkID || ',%'
    ) AS perks,
    server.queryDate
FROM ${server} AS server
LEFT JOIN MasterItemDefinitions AS master ON server.itemKey = master.ItemId COLLATE NOCASE
LEFT JOIN ArmorAppearances AS armor ON armor.ItemID = master.ArmorAppearanceM COLLATE NOCASE
LEFT JOIN WeaponAppearanceDefinitions AS weapon ON weapon.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
LEFT JOIN InstrumentsAppearanceDefinitions AS instruments ON instruments.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
LEFT JOIN server_metadata AS metadata ON metadata.name = :server COLLATE NOCASE
LEFT JOIN masteritem_en_us AS master_locale ON SUBSTR(master.Name, 2) = master_locale.key COLLATE NOCASE
WHERE metadata.lastSessionDate = server.sessionDate
AND (:category = 'all' OR master.TradingCategory = :category COLLATE NOCASE)
AND (:family = 'all' OR master.TradingFamily = :family COLLATE NOCASE)
AND (:group = 'all' OR master.TradingGroup = :group COLLATE NOCASE)
AND server.contractType = ${type}
${sort}
LIMIT 20 OFFSET (:page - 1) * 20;`
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
