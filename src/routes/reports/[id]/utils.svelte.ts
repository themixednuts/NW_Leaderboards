import { resolveRoute } from "$app/paths"
import type { PageData } from "./$types"
import { page } from '$app/stores'
import { get } from "svelte/store"
import type { DamageData, DamageEvent, DamageTypes, HealingEvent, LogEvent } from "@/events.types"
export type MappedData = {
  [k: string]: number | string
  dmgType: string
  critAmount: number
  critDamage: number
  critPercent: number
  meleeAmount: number
  meleeDamage: number
  meleePercent: number
  rangeAmount: number
  rangeDamage: number
  rangePercent: number
  damage: number
  IsFromStatusEffect: number
  statusEffectPercent: number
  statusEffectAmount: number
  hits: number
}

export type AwaitedReportLogs = Awaited<PageData['reports']>

function isDamageDoneEvent(event: LogEvent): event is DamageEvent {
  return (event as DamageEvent).data?.damage !== undefined && event.subtype === 'outgoing'
}

function isDamageTakenEvent(event: LogEvent): event is DamageEvent {
  return (event as DamageEvent).data?.damage !== undefined && event.subtype === 'incoming'
}

function isHealingDoneEvent(event: LogEvent): event is HealingEvent {
  return (event as HealingEvent).type === 'healing' && event.subtype === 'outgoing'
}
function isDeathEvent(event: LogEvent): event is LogEvent {
  // return event.type === 'death'
  return true
}

export const eventTypeHelpers = {
  damagedone: {
    check: (ev: LogEvent): ev is DamageEvent => isDamageDoneEvent(ev),
    reducer: damageDoneEventReducerCb,
    name: 'Damage Done',
    short: 'DPS',
    long: 'Amount',
  },
  damagetaken: {
    check: (ev: LogEvent): ev is DamageEvent => isDamageTakenEvent(ev),
    reducer: damageTakenEventReducerCb,
    name: 'Damage Taken',
    short: 'DTPS',
    long: 'Amount',
  },
  healingdone: {
    check: (ev: LogEvent): ev is HealingEvent => isHealingDoneEvent(ev),
    reducer: healingDoneReducerCb,
    name: 'Healing Done',
    short: 'HPS',
    long: 'Amount',
  },
  deaths: {
    check: (ev: LogEvent) => isDeathEvent(ev),
    reducer: () => { },
    name: 'Deaths',
    short: 'Time',
    long: 'Killed By',
  },
} as const

function damageDoneEventReducerCb(acc: Map<DamageTypes, MappedData>, curr: DamageEvent, idx: number, arr: DamageEvent[]) {
  for (const [dmgType, dmgData] of Object.entries(curr.data.damage) as [DamageTypes, NonNullable<DamageData[keyof DamageData]>][]) {
    if (!acc.has(dmgType))
      acc.set(dmgType, {
        dmgType,
        critAmount: 0,
        critDamage: 0,
        meleeAmount: 0,
        meleeDamage: 0,
        rangeAmount: 0,
        rangeDamage: 0,
        IsFromStatusEffect: 0,
        statusEffectPercent: 0,
        statusEffectAmount: 0,
        hits: 0,
        critPercent: 0,
        meleePercent: 0,
        rangePercent: 0,
        damage: 0,
      })
    const c = acc.get(dmgType)
    if (!c) return acc

    c.hits += 1
    for (const key of Object.keys(dmgData)) {
      if (key !== 'damage' && key !== 'mitigatedDamage' && key !== 'absorption') continue
      c[key] += dmgData[key]
      if (key !== 'damage') continue
      if (curr.data.damageFlags.IsFromStatusEffect) {
        c.statusEffectAmount += 1
        c.IsFromStatusEffect += dmgData[key]
        c.statusEffectPercent = c.statusEffectAmount / (idx + 1)
      }
      if (curr.data.damageFlags.Crit) {
        c.critAmount += 1
        c.critDamage += dmgData[key]
        c.critPercent = c.critAmount / (idx + 1)
      }
      if (!curr.data.damageFlags.IsFromStatusEffect) {
        if (curr.data.damageFlags.Ranged) {
          c.rangeAmount += 1
          c.rangeDamage += dmgData[key]
          c.rangePercent = c.rangeAmount / (idx + 1)
        } else if (!curr.data.damageFlags.Ranged) {
          c.meleeAmount += 1
          c.meleeDamage += dmgData[key]
          c.meleePercent = c.meleeAmount / (idx + 1)
        }
      }
    }
  }
  return acc
}
function damageTakenEventReducerCb(acc: Map<DamageTypes, MappedData>, curr: DamageEvent, idx: number, arr: DamageEvent[]) {
  for (const [dmgType, dmgData] of Object.entries(curr.data.damage) as [DamageTypes, NonNullable<DamageData[keyof DamageData]>][]) {
    if (!acc.has(dmgType))
      acc.set(dmgType, {
        dmgType,
        critAmount: 0,
        critDamage: 0,
        meleeAmount: 0,
        meleeDamage: 0,
        rangeAmount: 0,
        rangeDamage: 0,
        IsFromStatusEffect: 0,
        statusEffectPercent: 0,
        statusEffectAmount: 0,
        hits: 0,
        critPercent: 0,
        meleePercent: 0,
        rangePercent: 0,
        damage: 0,
      })
    const c = acc.get(dmgType)
    if (!c) return acc
    c.hits += 1
    for (const key of Object.keys(dmgData)) {
      // console.log(key);
      if (key !== 'damage' && key !== 'mitigatedDamage' && key !== 'absorption') continue
      c[key] ??= 0
      c[key] += dmgData[key]
      if (key !== 'damage') continue
      if (curr.data.damageFlags.IsFromStatusEffect) {
        c.statusEffectAmount += 1
        c.IsFromStatusEffect += dmgData[key]
        c.statusEffectPercent = c.statusEffectAmount / (idx + 1)
      }
      if (curr.data.damageFlags.Crit) {
        c.critAmount += 1
        c.critDamage += dmgData[key]
        c.critPercent = c.critAmount / (idx + 1)
      }
      if (!curr.data.damageFlags.IsFromStatusEffect) {
        if (curr.data.damageFlags.Ranged) {
          c.rangeAmount += 1
          c.rangeDamage += dmgData[key]
          c.rangePercent = c.rangeAmount / (idx + 1)
        } else if (!curr.data.damageFlags.Ranged) {
          c.meleeAmount += 1
          c.meleeDamage += dmgData[key]
          c.meleePercent = c.meleeAmount / (idx + 1)
        }
      }
    }
  }
  return acc
}

function healingDoneReducerCb(acc: { amount: number }, curr: HealingEvent, idx: number, arr: HealingEvent[]) {
  acc.amount += curr.data.amount
  return acc
}
function deathsReducerCb(acc: number, curr: HealingEvent, idx: number, arr: HealingEvent[]) {
  return acc + curr.data.amount
}

// export function getEventsByTypePerCharacter(report: AwaitedReportLogs[number], type: keyof typeof eventTypeHelpers, start?: string | null, end?: string | null) 
// export function getEventsByTypePerCharacter(reports: AwaitedReportLogs | undefined, type: 'healingdone' | 'deaths', start?: string | null, end?: string | null): { amount: number }
// export function getEventsByTypePerCharacter(reports: AwaitedReportLogs | undefined, type: 'damagedone' | 'damagetaken', start?: string | null, end?: string | null): Parameters<typeof eventTypeHelpers[typeof type]['reducer']>[0]
export function getEventsByTypePerCharacter(reports: AwaitedReportLogs, type: keyof typeof eventTypeHelpers, start?: string | null, end?: string | null) {
  switch (type) {
    case 'damagedone' || 'damagetaken':
      return reports
        .map(report => ({
          data: [
            ...report.data
              .filter((event, idx, arr): event is DamageEvent => eventTypeHelpers[type].check(event) && event.eventAt >= (start ? +start : arr[0].eventAt) && event.eventAt <= (end ? +end : arr[arr.length - 1].eventAt))
              .reduce(eventTypeHelpers[type].reducer, new Map())
              .values()
          ],
          character: report.character
        }))
    case 'healingdone':
      return reports
        .map(report => ({
          data: report.data
            .filter((event, idx, arr): event is HealingEvent => eventTypeHelpers[type].check(event) && event.eventAt >= (start ? +start : arr[0].eventAt) && event.eventAt <= (end ? +end : arr[arr.length - 1].eventAt))
            .reduce(eventTypeHelpers[type].reducer, { amount: 0 }),
          character: report.character
        }))

  }
  return
}
export function getTargetsByDamageType(logs: LogEvent[], dmgType: string) {
  if (!logs) return
  const filtered = logs.filter(
    (event): event is DamageEvent => isDamageDoneEvent(event) && event.data.damage[dmgType] !== undefined
  )

  const reduced = filtered.reduce(
    (acc, curr) => {
      acc.targets.set(curr.data.marker?.npcName, curr.data.marker)

      return acc
    },
    { targets: new Map() }
  )
  return reduced
}
export function resolvePath(character: string | undefined, type: string) {
  if (!character) return ''
  const searchParam = new URLSearchParams(get(page).url.searchParams)
  searchParam.set('type', type)
  const path =
    resolveRoute(`/reports/[id]/[character]`, {
      id: get(page).params.id,
      character,
    }) + (searchParam.toString() ? `?${searchParam.toString()}` : '')
  return path
}
export function tooltipData(rows: MappedData[], totalDamage: number) {
  return {
    headers: [
      { text: 'Type', class: 'w-28' },
      { text: 'Damage', class: '' },
      { text: 'Crit %', class: 'w-16' },
    ],
    rows: rows.map((row) => ({
      cells: [
        { text: row.dmgType },
        {
          text: row.damage,
          total: totalDamage,
          class: 'relative grid min-w-56 grid-cols-[.4fr,1fr] items-center gap-3',
        },
        { text: (row.critAmount / row.hits).toFixed(2) },
      ],
    })).sort((a, b) => +b.cells[1].text - +a.cells[1].text),
  }
}
