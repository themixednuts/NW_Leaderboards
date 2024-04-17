import type { PageServerLoad, Actions, Action } from './$types'
import { db } from '$lib/server/db/gamedata/client'
import { characters, charactersToGroups, logs } from '@/schemas/gamedata'
import { getTableColumns, gt, isNotNull, or, sql, type InferInsertModel } from 'drizzle-orm'
import { fail, message, setError, superValidate, withFiles, type Infer } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema, type FormSchema } from './schema'
import { groups, paperdolls, type guilds } from '@/schemas/gamedata'
import type { LogEvent } from '@/events.types'
import { lines } from '@/utils'

export const load = (async () => {
  return {
    form: await superValidate(zod(formSchema))
  }
}) satisfies PageServerLoad

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema))
    if (!form.valid) return fail(400, { form })

    const session = await event.locals.auth()
    if (!session?.user?.id) {
      return fail(400, { type: 'Not Authorized', message: 'Please login' })
    }

    const file = form.data.files
    // const visibility = form.get('visibility')

    if (!file) return fail(400, { type: "Invalid form data", message: "The file type submitted is invalid.", hint: 'Use a JSON or Plaint Text file.' })

    if (!(file instanceof File)) return fail(400, { error: "Invalid form data", message: "The file type submitted is invalid.", hint: 'Use a JSON or Plaint Text file.' })

    const text = await file.text()
    let appId: number
    let uploaderCharacterId: string
    const log = {
      data: [] as LogEvent[],
      characterIds: new Map<string, InferInsertModel<typeof characters> & { eventAt: number }>(),
      groupIds: new Map<string, InferInsertModel<typeof groups> & { characterIds: Set<string> }>(),
      paperdollSlots: new Map<number, InferInsertModel<typeof paperdolls>>()
    }

    for (const line of lines(text.trim())) {
      try {
        const obj: LogEvent = JSON.parse(line)
        log.data.push(obj)

        if (!obj.data) continue

        const {
          //@ts-expect-error
          characterId,
          //@ts-expect-error
          playerFaction,
          //@ts-expect-error
          playerWorldId,
          //@ts-expect-error
          playerIconData,
          //@ts-expect-error
          playerName,
          //@ts-expect-error
          playerLevel,
          //@ts-expect-error
          slotId,
          //@ts-expect-error
          equipSlot,
          //@ts-expect-error
          gearScore,
          //@ts-expect-error
          itemId,
          //@ts-expect-error
          perks,
          //@ts-expect-error
          groupId,
          //@ts-expect-error
          numPlayers,
          //@ts-expect-error
          guildId,
          //@ts-expect-error
          productId,
        } = obj.data

        if (productId) {
          appId = Number((productId as string).replace('STEAM_APP_ID.', ''))
        }

        if (groupId) {
          if (log.groupIds.has(groupId)) {
            if (characterId) {
              const group = log.groupIds.get(groupId)
              group?.characterIds.add(characterId)
            }
          } else {
            log.groupIds.set(groupId, {
              id: groupId,
              characterIds: new Set()
            })

            if (characterId) {
              const group = log.groupIds.get(groupId)
              group?.characterIds.add(characterId)
            }
          }
        }

        if (slotId >= 0) {
          log.paperdollSlots.set(slotId, {
            itemId,
            characterId,
            gearscore: gearScore,
            perks,
          })
        }

        if (characterId) {
          if (log.characterIds.has(characterId)) {
            const character = log.characterIds.get(characterId)

            if (character) {
              character.guildId ??= guildId
              character.factionId ??= playerFaction
              character.userId ??= obj.type === 'log' ? session.user.id : undefined
              character.worldId ??= playerWorldId
              character.steamAppId ??= appId!

              if (playerIconData) {
                const { foregroundImagePath, backgroundImagePath, midgroundImagePath, foregroundColor, backgroundColor, midgroundColor } = playerIconData

                if (foregroundImagePath) character.foregroundImagePath = foregroundImagePath
                if (backgroundImagePath) character.backgroundImagePath = backgroundImagePath
                if (midgroundImagePath) character.midgroundImagePath = midgroundImagePath
                if (foregroundColor) character.foregroundColor = foregroundColor
                if (midgroundColor) character.midgroundColor = midgroundColor
                if (backgroundColor) character.backgroundColor = backgroundColor
              }
            }
          } else {
            log.characterIds.set(characterId, {
              id: characterId,
              name: playerName,
              guildId,
              level: playerLevel,
              userId: obj.type === 'log' ? session.user.id : undefined,
              factionId: playerFaction,
              backgroundImagePath: playerIconData ? playerIconData.backgroundImagePath : null,
              foregroundImagePath: playerIconData ? playerIconData.foregroundImagePath : null,
              midgroundImagePath: playerIconData ? playerIconData.midgroundImagePath : null,
              foregroundColor: playerIconData ? playerIconData.foregroundColor : null,
              midgroundColor: playerIconData ? playerIconData.midgroundColor : null,
              backgroundColor: playerIconData ? playerIconData.backgroundColor : null,
              worldId: playerWorldId,
              eventAt: obj.eventAt,
              steamAppId: appId!,
            })
          }

          if (obj.type === 'log') {
            uploaderCharacterId = characterId
          }
        }

      }
      catch (err) {
        console.log("Error: %s\n", err, line)
      }
    }

    const firstRow = log.data[0]
    const logStart = log.data.find(event => event.type === 'log' && event.subtype === 'start')
    const lastRow = log.data[log.data.length - 1]

    try {
      await db.transaction(async (tx) => {
        const chars = [...log.characterIds].map(characterMap => ({ ...characterMap[1] }))
        if (!!chars.length) {
          const columnNames = getTableColumns(characters)

          for (const char of chars) {
            const stmt = tx.insert(characters).values(char)
              .onConflictDoUpdate({
                target: characters.id,
                set: {
                  name: sql.raw(`COALESCE(EXCLUDED.${columnNames.name.name}, characters.${columnNames.name.name})`),
                  guildId: sql.raw(`COALESCE(EXCLUDED.${columnNames.guildId.name}, characters.${columnNames.guildId.name})`),
                  level: sql.raw(`COALESCE(EXCLUDED.${columnNames.level.name},characters.${columnNames.level.name})`),
                  factionId: sql.raw(`COALESCE(EXCLUDED.${columnNames.factionId.name},${columnNames.factionId.name})`),
                  foregroundImagePath: sql.raw(`COALESCE(EXCLUDED.${columnNames.foregroundImagePath.name},characters.${columnNames.foregroundImagePath.name})`),
                  backgroundImagePath: sql.raw(`COALESCE(EXCLUDED.${columnNames.backgroundImagePath.name},characters.${columnNames.backgroundImagePath.name})`),
                  midgroundImagePath: sql.raw(`COALESCE(EXCLUDED.${columnNames.midgroundImagePath.name},characters.${columnNames.midgroundImagePath.name})`),
                  foregroundColor: sql.raw(`COALESCE(EXCLUDED.${columnNames.foregroundColor.name},characters.${columnNames.foregroundColor.name})`),
                  backgroundColor: sql.raw(`COALESCE(EXCLUDED.${columnNames.backgroundColor.name},characters.${columnNames.backgroundColor.name})`),
                  midgroundColor: sql.raw(`COALESCE(EXCLUDED.${columnNames.midgroundColor.name}, characters.${columnNames.midgroundColor.name})`),
                  worldId: sql.raw(`COALESCE(EXCLUDED.${columnNames.worldId.name},characters.${columnNames.worldId.name})`),
                  steamAppId: sql.raw(`COALESCE(EXCLUDED.${columnNames.steamAppId.name}, characters.${columnNames.steamAppId.name})`),
                  updatedAt: sql`CURRENT_TIMESTAMP`
                },
                where: or(
                  isNotNull(sql.raw(`EXCLUDED.${columnNames.name.name}`)),
                  isNotNull(sql.raw(`EXCLUDED.${columnNames.guildId.name}`)),
                  isNotNull(sql.raw(`EXCLUDED.${columnNames.level.name}`)),
                  isNotNull(sql.raw(`EXCLUDED.${columnNames.factionId.name}`)),
                  isNotNull(sql.raw(`EXCLUDED.${columnNames.foregroundImagePath.name}`)),
                  isNotNull(sql.raw(`EXCLUDED.${columnNames.backgroundImagePath.name}`)),
                  isNotNull(sql.raw(`EXCLUDED.${columnNames.midgroundImagePath.name}`)),
                  isNotNull(sql.raw(`EXCLUDED.${columnNames.foregroundColor.name}`)),
                  isNotNull(sql.raw(`EXCLUDED.${columnNames.backgroundColor.name}`)),
                  isNotNull(sql.raw(`EXCLUDED.${columnNames.midgroundColor.name}`)),
                  isNotNull(sql.raw(`EXCLUDED.${columnNames.steamAppId.name}`)),
                  isNotNull(sql.raw(`EXCLUDED.${columnNames.worldId.name}`)),
                )
              })
            await stmt
          }
        }

        const slots = [...log.paperdollSlots].map(slot => {

          const slotId = slot[0]
          const { itemId, gearscore, perks } = slot[1]

          const stmt = tx.insert(paperdolls).values({
            characterId: uploaderCharacterId,
            slotId,
            itemId,
            perks,
            gearscore,
          })
            .onConflictDoUpdate({
              target: [paperdolls.characterId, paperdolls.slotId],
              set: {
                gearscore: sql`COALESCE(EXCLUDED.gearscore, gearscore)`,
                itemId: sql`COALESCE(EXCLUDED.item_id, item_id)`,
                perks: sql`COALESCE(EXCLUDED.perks, perks)`,
              },
            })
          return stmt
        })
        for (const stmt of slots) {
          await stmt
        }

        const grp = [...log.groupIds].map(groupsMap => ({ ...groupsMap[1] }))
        if (!!grp.length) {
          const stmt = tx.insert(groups).values(grp).onConflictDoNothing()
          const grp_chars = grp.flatMap(group => [...group.characterIds].map(id => ({ groupId: group.id, characterId: id })))
          const grp_chars_stmt = tx.insert(charactersToGroups).values(grp_chars).onConflictDoNothing()

          await stmt
          await grp_chars_stmt
        }

        const stmt = tx.insert(logs).values({
          userId: session!.user!.id as string,
          //@ts-expect-error
          gameModeId: firstRow.data.gameModeId,
          fileName: file.name.replace(".json", ""),
          data: log.data,
          //@ts-expect-error
          characterId: logStart?.data.characterId,
          guildId: logStart?.data.guildId
        }).returning({ id: logs.id }).get()
        const logId = (await stmt).id

        // const chars_logs = [...log.characterIds].map(character => ({ characterId: character[0], logId }))
        // if (!!chars_logs.length) {
        //   await tx.insert().values(chars_logs)
        // }

      }, { behavior: 'deferred' })


    } catch (err) {
      console.log(err)
      return setError(form, 'files', 'Error inserting into database')
    }
    return message(form, 'Parsed combat logs')
  }
} satisfies Actions

