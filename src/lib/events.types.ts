export type LogEvent = CombatEvent
  | HealthMaxEvent
  | HealthValueEvent
  | HealthPercentEvent
  | TerritoryEnteredEvent
  | TerritoryExitedEvent
  | ManaMaxEvent
  | ManaValueEvent
  | WorldPositionEvent
  | WaypointPositionEvent
  | CameraPositionEvent
  | StaminaLockedEvent
  | StaminaMaxEvent
  | StaminaValueEvent
  | DamageEvent
  | HealingEvent
  | DeathEvent
  | DeathsDoorEvent
  | HeartruneChargeEvent
  | GritEvent
  | GritPercentEvent
  | ActiveWeaponEvent
  | PaperdollEvent
  | EquipLoadCategoryEvent
  | EquipLoadEvent
  | GamemodeBossEvent
  | GamemodeEvent
  | LogStartEvent
  | LogEndEvent
  | GroupEvent
  | GroupMemberAddedEvent
  | GroupMemberRemovedEvent
  | GroupRoleEvent
  | RaidDisbandEvent
  | RaidMaxGroupsEvent
  | RaidNewEvent
  | LevelEvent
  | FactionEvent
  | StatusEffectActiveEvent
  | StatusEffectInActiveEvent
  | StatusEffectStackEvent
  | AbilityTriggeredEvent
  | PowerLevelEvent

interface CommonEvent {
  eventAt: number
}

interface CommonData {
  characterId: string
  playerName: string
}

export interface CrestData {
  foregroundImagePath: string
  backgroundImagePath: string
  midgroundImagePath: string
  foregroundColor: string
  backgroundColor: string
  midgroundColor: string
}

export interface CombatEvent extends CommonEvent {
  type: "event"
  subtype: 'incombat'
  data: {
    isInCombat: boolean
  } & CommonData
}

export interface HealthMaxEvent extends CommonEvent {
  type: 'health'
  subtype: 'max'
  data: {
    value: number
  } & CommonData
}

export interface HealthValueEvent extends CommonEvent {
  type: 'health'
  subtype: 'value'
  data: {
    value: number
  } & CommonData
}

export interface TerritoryEnteredEvent extends CommonEvent {
  type: 'territory'
  subtype: 'entered'
  data: {
    territoryId: number
  } & CommonData
}

export interface TerritoryExitedEvent extends CommonEvent {
  type: 'territory'
  subtype: 'exited'
  data: {
    territoryId: number
  } & CommonData
}

export interface ManaMaxEvent extends CommonEvent {
  type: 'mana'
  subtype: 'max'
  data: {
    value: number
  } & CommonData
}

export interface ManaValueEvent extends CommonEvent {
  type: 'mana'
  subtype: 'value'
  data: {
    value: number
  } & CommonData
}

export interface WorldPositionEvent extends CommonEvent {
  type: 'position'
  subtype: 'world'
  data: {
    value: {
      x: number
      y: number
      z: number
    }
    speed: number
  } & CommonData
}

export interface CameraPositionEvent extends CommonEvent {
  type: 'position'
  subtype: 'camera'
  data: {
    value: {
      x: number
      y: number
      z: number
    }
    heading: number
    fov: number
    frustumHeight: number
    frustumWidth: number
    nearClipDistance: number
    farClipDistance: number
  } & CommonData
}

export interface WaypointPositionEvent extends CommonEvent {
  type: 'position'
  subtype: 'waypoint'
  data: {
    value: {
      x: number
      y: number
      z: number
    }
  } & CommonData
}

export interface StaminaMaxEvent extends CommonEvent {
  type: 'stamina'
  subtype: 'max'
  data: {
    value: number
  } & CommonData
}

export interface StaminaValueEvent extends CommonEvent {
  type: 'stamina'
  subtype: 'value'
  data: {
    value: number
  } & CommonData
}

export interface StaminaLockedEvent extends CommonEvent {
  type: 'stamina'
  subtype: 'locked'
  data: {
    value: boolean
  } & CommonData
}

export interface HeartruneChargeEvent extends CommonEvent {
  type: 'heartrune'
  subtype: 'percent'
  data: {
    percent: number
  } & CommonData
}

export interface DeathEvent extends CommonEvent {
  type: 'vitals'
  subtype: 'isDead'
  data: {
    isDead: boolean
  } & CommonData
}

export interface GritPercentEvent extends CommonEvent {
  type: 'grit'
  subtype: 'percent'
  data: {
    percent: number
  } & CommonData
}

export interface ActiveWeaponEvent extends CommonEvent {
  type: 'equipment'
  subtype: 'activeweapon'
  data: {
    activeWeaponSlot: number
    itemType: string
    gearscore: number
    baseDamage: number
  } & CommonData
}


export interface PowerLevelEvent extends CommonEvent {
  type: 'paperdoll'
  subtype: 'powerlevel'
  data: {
    playerPowerLevel: number
  } & CommonData
}


export interface EquipLoadEvent extends CommonEvent {
  type: 'paperdoll'
  subtype: 'equipload'
  data: {
    equipLoad: number
  } & CommonData
}

export interface EquipLoadCategoryEvent extends CommonEvent {
  type: 'paperdoll'
  subtype: 'equiploadcategory'
  data: {
    equipLoadCategory: string
  } & CommonData
}

export interface LevelEvent extends CommonEvent {
  type: 'vitals'
  subtype: 'level'
  data: {
    playerLevel: number
  } & CommonData
}

export interface FactionEvent extends CommonEvent {
  type: 'vitals'
  subtype: 'faction'
  data: {
    playerFaction: number
  } & CommonData
}

export interface GroupEvent extends CommonEvent {
  type: 'group'
  subtype: 'new' | 'disband'
  data: {
    groupId: string
  } & CommonData
}

export interface RaidNewEvent extends CommonEvent {
  type: 'raid'
  subtype: 'new'
  data: {
    raidId: string
  }
}

export interface RaidDisbandEvent extends CommonEvent {
  type: 'raid'
  subtype: 'disband'
  data: {}
}

export interface RaidMaxGroupsEvent extends CommonEvent {
  type: 'raid'
  subtype: 'maxgroups'
  data: {
    maxGroup: number
    raidId: number
  }
}

export interface StatusEffectInActiveEvent extends CommonEvent {
  type: 'statuseffect'
  subtype: 'inactive'
  data: {
    endTime: number
    id: string
    name: string
    idx: number
  } & CommonData
}

export interface StatusEffectActiveEvent extends CommonEvent {
  type: 'statuseffect'
  subtype: 'active'
  data: {
    endTime: number
    id: string
    name: string
    idx: number
    potency: number
    stackSize: number
    isNegative: boolean
  } & CommonData
}

export interface StatusEffectStackEvent extends CommonEvent {
  type: 'statuseffect'
  subtype: 'stacksize'
  data: {
    endTime: number
    id: string
    name: string
    idx: number
    potency: number
    stackSize: number
    isNegative: boolean
  } & CommonData
}

export interface LogStartEvent extends CommonEvent {
  type: 'log'
  subtype: 'start'
  data: {
    playerLevel: number
    playerFaction: number
    playerWorldId: number
    guildId: number
    guildFaction: number
    guildName: string
    guildCrestData: CrestData
    memberCount: number
    playerIconData: CrestData
    channelName: string
    regionId: string
    version: string
    changeList: string
    playerPowerLevel: number
    guildLeader: number
    options: {
      damage: boolean
      equipment: boolean
      healing: boolean
      misc: boolean
      combatOnly: boolean
      position: boolean
      scope: number
      statusEffect: boolean
      vitals: boolean
    }

  }
}

export interface LogEndEvent extends CommonEvent {
  type: 'log'
  subtype: 'end'
  data: CommonData
}

export interface PaperdollEvent extends CommonEvent {
  type: 'paperdoll'
  subtype: 'initialize' | 'itemequipped' | 'itemunequipped' | 'itemskinchanged' | 'itemskindyed'
  data: {
    slotId: number
    equipSlot: string
    gearscore: number
    itemId: string
    itemName: string
    itemIcon: string
    rarity: number
    isBroken: boolean
    tier: number
    baseDamage: number
    perks: string[]
    quantity: number
    isNamed: boolean
  } & CommonData
}

export interface GritEvent extends CommonEvent {
  type: 'grit'
  subtype: 'enter' | 'exit'
  data: CommonData
}

export interface GamemodeEvent extends CommonEvent {
  type: 'gamemode'
  subtype: 'entered' | 'exited'
  data: {
    gameModeId: number
    gameModeName: string
  } & CommonData
}

export interface GamemodeBossEvent extends CommonEvent {
  type: 'gamemode'
  subtype: 'inbossfight'
  data: {
    gameModeId: number
    gameModeName: string
    inBossFight: boolean
  } & CommonData
}

export interface AbilityTriggeredEvent extends CommonEvent {
  type: 'ability'
  subtype: 'triggered'
  data: {
    name: string
  } & CommonData
}


export interface HealingEvent extends CommonEvent {
  type: 'healing'
  subtype: 'incoming' | 'outgoing',
  data: HealingEventData & CommonData
}

export interface DamageEvent extends CommonEvent {
  type: 'damage'
  subtype: 'incoming' | 'outgoing'
  data: DamageEventData & CommonData
}

export type DamageEventData = {
  damage: DamageData,
  damageFlags: DamageFlagsData
  distanceFromLocalPlayerSq: number
  marker?: DamageMarkerData & Partial<CommonData>
}

export type DamageMarkerData = {
  healthPercent: number
  maxHealth: number
  npcName?: string
  type: string
  worldPosition: { x: number, y: number, z: number }
}
export type DamageFlagsData = {
  CanCrit: boolean
  Crit: boolean
  DamageCausedDeath: boolean
  DamageCausedDeathsDoor: boolean
  Headshot: boolean
  IsFromStatusEffect: boolean
  IsFullyAbsorbed: boolean
  IsImmortal: boolean
  Ranged: boolean
  Resisted: boolean
  SelfDamage: boolean
  Structure: boolean
}

export interface HealingEventData extends CommonData {
  amount: number,
  modifier: number,
  reduction: number,
  distanceFromLocalPlayerSq: number,
}

export type DamageTypes = 'Thrust' | 'Slash' | 'Strike' | 'Standard' | 'Nature'

export type DamageData = {
  [k in DamageTypes]?: {
    absorption: number,
    damage: number,
    damageModifier: number,
    isPrimary: true,
    mitigatedDamage: number,
    weakness: number
  }
}

export interface GroupMemberAddedEvent extends CommonEvent {
  type: 'group'
  subtype: 'added'
  data: {
    groupIdx: number
    groupMember: number
    isMemberSwap: boolean
    joinedNewGroup: boolean
    groupId: number
  } & CommonData
}

export interface GroupMemberRemovedEvent extends CommonEvent {
  type: 'group'
  subtype: 'removed'
  data: {
    raidGroup: number
    groupMember: number
    groupId: number
  } & CommonData
}

export interface HealthPercentEvent extends CommonEvent {
  type: 'health'
  subtype: 'percent'
  data: {
    groupIdx?: number
    groupMember?: number
    groupId?: number
    healthPercent: number
  } & CommonData
}

export interface DeathsDoorEvent extends CommonEvent {
  type: 'vitals'
  subtype: 'deathsdoor'
  data: {
    groupIdx?: number
    groupMember?: number
    groupId?: number
    isDeathsDoor: boolean
  } & CommonData
}

export interface SocialStatusEvent extends CommonEvent {
  type: 'social'
  subtype: 'online'
  data: {
    groupIdx?: number
    groupMember?: number
    groupId?: number
    isOnline: boolean
  } & CommonData
}

export interface GroupRoleEvent extends CommonEvent {
  type: 'group'
  subtype: 'role'
  data: {
    groupIdx: number
    groupMember: number
    groupId: number
    newRole: number
  } & CommonData
}
