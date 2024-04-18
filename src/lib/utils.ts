import type { LogEvent } from "./events.types"

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
  const modifiedHtmlString = htmlString.replace(/(src="([^"]*?)(?<!\.png)")/g, (match, src) => {
    // Append ".png" to the src attribute if it doesn't already have it
    return `${src.toLowerCase().slice(0, -1)}.png"`
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
  WHERE 
    CASE
      WHEN :category = 'all' THEN 1
      ELSE :category = master.TradingCategory COLLATE NOCASE
    END
  AND 
    CASE
      WHEN :family = 'all' THEN 1
      ELSE :family = master.TradingFamily COLLATE NOCASE
    END
  AND 
    CASE
      WHEN :group = 'all' THEN 1
      ELSE :group = master.TradingGroup COLLATE NOCASE
    END
  AND 
    CASE 
      WHEN :item = 'all' THEN 1
      ELSE :item = itemKey
    END
  AND
    CASE
      WHEN :price_min = 'all' AND :price_max = 'all' THEN 1
      WHEN :price_min = 'all' THEN price <= :price_max
      WHEN :price_max = 'all' THEN price >= :price_min
      ELSE price BETWEEN :price_min AND :price_max
    END
  AND
    CASE
      WHEN :gearscore_min = 'all' AND :gearscore_max = 'all' THEN 1
      WHEN :gearscore_min = 'all' THEN gearScore <= :gearscore_max
      WHEN :gearscore_max = 'all' THEN gearScore >= :gearscore_min
      ELSE gearScore BETWEEN :gearscore_min AND :gearscore_max
    END
  AND
    CASE
      WHEN :perks != '' THEN ',' || perks || ',' LIKE '%,' || :perks || ',%'
      ELSE 1
    END
  AND contractType = :type
  -- AND server = :server
  AND sessionDate = (SELECT sessionDate FROM server_metadata WHERE server = :server)
  ${sort ? sort : ''}
  LIMIT 20 OFFSET (:page - 1) * 20;
  `
  return query
}

export function getLocalizedDate(timeStamp: string) {
  let date: Date
  const unixTimeStampPattern = /^[0-9]+$/
  if (unixTimeStampPattern.test(timeStamp)) date = new Date(+timeStamp * 1000)
  else date = new Date(timeStamp)
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

export function formatNumberToSI(number: number) {
  const units = ['', 'K', 'M', 'B', 'T']
  const unitIndex = Math.floor(Math.log10(Math.abs(number)) / 3)
  const value = number / Math.pow(1000, unitIndex)

  return value.toFixed(2) + units[unitIndex]
}

export function addPNG(string: string) {
  const regex = /<img.*?src="(.*?)".*?>/i
  const matches = regex.exec(string)
  if (!matches) return string

  const srcAttributeValue = matches[1]

  // Append .png to the src attribute value
  const modifiedSrc = '/' + srcAttributeValue + '.png'
  const modifiedString = string.replace(srcAttributeValue, modifiedSrc)
  return modifiedString
}

declare global {
  export interface ObjectConstructor {
    /**
     * Groups members of an iterable according to the return value of the passed callback.
     * @param items An iterable.
     * @param keySelector A callback which will be invoked for each item in items.
     */
    groupBy<K extends PropertyKey, T>(
      items: Iterable<T>,
      keySelector: (item: T, index: number) => K,
    ): Partial<Record<K, T[]>>
  }

  export interface MapConstructor {
    /**
     * Groups members of an iterable according to the return value of the passed callback.
     * @param items An iterable.
     * @param keySelector A callback which will be invoked for each item in items.
     */
    groupBy<K, T>(
      items: Iterable<T>,
      keySelector: (item: T, index: number) => K,
    ): Map<K, T[]>
  }
}

export const steamAppIdMap = {
  1063730: 'Live',
  1205550: 'PTR',
  1183900: 'Mkt'
}

export interface WorldsData {
  servers: { worldId: string, worldName: string, region: string, isRTA: boolean, isFS: boolean }[]
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(timer: ReturnType<typeof setTimeout> | undefined, callback: T, delay: number) {
  return new Promise<ReturnType<T> | Error>((resolve, reject) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      try {
        //@ts-expect-error
        resolve(callback())
      } catch (err) {
        if (err instanceof Error) {
          reject(err)
        }
        reject(new Error(`An error has occurred: ${err}`))
      }
    }, delay)
  })
}

export const normalize_name = (name: string) => {
  return name.replaceAll(' ', '_')
}

export enum FACTIONS {
  Guildless,
  Syndacite,
  Maruaders,
  Covenant
}

export function secondsToTimeFormat(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}
export function* lines(text: string) {
  const lines = text.split('\n')
  for (const line of lines) {
    yield line
  }
}
export const getRelativeEventTime = (currentTime: number, firstTime: number) => {

  const elapsedMilliseconds = currentTime - firstTime
  const minutes = Math.floor(elapsedMilliseconds / (60 * 1000))
  const seconds = Math.floor((elapsedMilliseconds % (60 * 1000)) / 1000)
  const milliseconds = Math.floor(elapsedMilliseconds % 1000)

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`

}

export function translateEvent(event: LogEvent) {

  if (event.type === 'position') {
    switch (event.subtype) {
      case 'waypoint': return `${event.data.playerName} placed waypoint at (${event.data.value?.x}, ${event.data.value?.y})`
      case 'world': return `${event.data.playerName} moved to (${event.data.value?.x}, ${event.data.value?.y}, ${event.data.value?.z})`
      case 'camera': return `${event.data.playerName}'s camera moved to (${event.data.value?.x}, ${event.data.value?.y}, ${event.data.value?.z})`

    }
  }
  else if (event.type === 'group') {
    switch (event.subtype) {
      case 'added': return `${event.data.playerName} was added to group ${event.data.groupId}, group member ${event.data.groupMember}`
      case 'removed': return `${event.data.playerName} was removed from group ${event.data.groupId}`
      case 'new': return `Group created -> ${event.data.groupId}`
      case 'disband': return `Group disbanded -> ${event.data.groupId}`
      case 'role': return `${event.data.playerName}'s role changed to ${event.data.newRole}`
    }
  }
  else if (event.type === 'health') {
    switch (event.subtype) {
      case 'percent': return `${event.data.playerName}'s health percentage changed to ${event.data.healthPercent}%`
      case 'value': return `${event.data.playerName}'s health changed to ${event.data.value}`
      case 'max': return `${event.data.playerName}'s max health changed to ${event.data.value}`
    }
  }
  else if (event.type === 'statuseffect') {
    switch (event.subtype) {
      case 'stacksize': return `${event.data.playerName}'s ${event.data.id.replaceAll('_', ' ')} stack at ${event.data.stackSize}`
      case 'active': return `${event.data.playerName} gained ${event.data.id.replaceAll('_', ' ')}`
      case 'inactive': return `${event.data.playerName} lost ${event.data.id.replaceAll('_', ' ')}`
    }
  }
  else if (event.type === 'gamemode') {
    switch (event.subtype) {
      case 'entered': return `Entered game mode ${event.data.gameModeName}`
      case 'exited': return `Exited game mode ${event.data.gameModeName}`
      case 'inbossfight': return `In boss fight is ${event.data.inBossFight}`
    }
  }
  // else if (event.type === 'territory') {
  //     switch (event.subtype) {
  //         case 'entered': return `Entered zone ${event.data.territoryName}`
  //         case 'exited': return `Exited zone ${event.data.territoryName}`
  //     }
  // }
  else if (event.type === 'raid') {
    switch (event.subtype) {
      case 'disband': return `Raid disbanded`
      case 'maxgroups': return `Raid's max group amount is ${event.data.maxGroup}`
      case 'new': return `Raid created -> ${event.data.raidId}`
      // case 'membercount': return `Raid's member count is ${event.data.memberCount}`
    }
  }
  else if (event.type === 'damage') {
    switch (event.subtype) {
      case 'outgoing': return `${event.data.playerName} dealt ${Object.entries(event.data.damage).map(([damageType, damageData]) => `${damageType}: ${Math.floor(damageData.damage)} (${Math.floor(damageData.mitigatedDamage)})`).join(' , ')} damage to ${event.data.marker?.playerName || event.data.marker?.npcName || ''}`
      case 'incoming': return `${event.data.playerName} received ${Object.entries(event.data.damage).map(([damageType, damageData]) => `${damageType}: ${Math.floor(damageData.damage)} (${Math.floor(damageData.mitigatedDamage)})`).join(' , ')} damage from ${event.data.marker?.playerName || event.data.marker?.npcName || ''}`
    }
  }
  else if (event.type === 'healing') {
    switch (event.subtype) {
      case 'incoming': return `${event.data.playerName} received ${event.data.amount} heals`
    }
  }
  else if (event.type === 'paperdoll') {
    switch (event.subtype) {
      case 'powerlevel': return `Power Level changed to ${event.data.playerPowerLevel}`
      case 'equipload': return `Equip Load changed to ${event.data.equipLoad / 10}`
      case 'equiploadcategory': return `Equip Load Category changed to ${event.data.equipLoadCategory}`
      case 'itemunequipped': return `Unequipped item from ${event.data.equipSlot}`
      case 'initialize': return `Paperdoll initialize slot ${event.data.slotId} ${event.data.equipSlot ?? ''} ${event.data.itemName ? 'with ' + event.data.itemName : ''} ${event.data.gearscore || ''}`
    }
  }
  else if (event.type === 'equipment') {
    switch (event.subtype) {
      case 'activeweapon': return `${event.data.playerName} active weapon changed to ${event.data.activeWeaponSlot}`
    }
  }
  else if (event.type === 'stamina') {
    switch (event.subtype) {
      case 'value': return `${event.data.playerName}'s stamina changed to ${event.data.value}`
      case 'max': return `${event.data.playerName}'s max stamina changed to ${event.data.value}`
    }
  }
  else if (event.type === 'mana') {
    switch (event.subtype) {
      case 'value': return `${event.data.playerName}'s mana changed to ${event.data.value}`
      case 'max': return `${event.data.playerName}'s max mana changed to ${event.data.value}`
    }
  }
  else if (event.type === 'grit') {
    switch (event.subtype) {
      case 'enter': return `${event.data.playerName || ''} gained grit`
      case 'exit': return `${event.data.playerName || ''} lost grit`
    }
  }
  else if (event.type === 'vitals') {
    switch (event.subtype) {
      case 'deathsdoor': return `${event.data.playerName}'s deaths door state changed to ${event.data.isDeathsDoor}`
      case 'isDead': return `${event.data.playerName} ${event.data.isDead ? 'died' : 'is alive'}`
    }
  }
  else if (event.type === 'ability') {
    switch (event.subtype) {
      case 'triggered': return `Ability ${event.data.name} triggered`
    }

  }
  else if (event.type === 'heartrune') {
    switch (event.subtype) {

    }
  }
  else if (event.type === 'log') {
    switch (event.subtype) {
      case 'start': return `Log started`
      case 'end': return `Log ended`
    }
  }
  // case 'social' + 'online': return `${event.data.playerName}'s online state changed to ${event.data.isOnline}`
  else return `${event.type} -> ${event.subtype}`
}

export enum GUILD_RANKS {
  settler,
  officer,
  consul,
  governor
}
