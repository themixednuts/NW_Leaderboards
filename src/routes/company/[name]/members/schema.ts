import { insertCharacterSchema } from '@/schemas/gamedata'

export const formSchema = insertCharacterSchema.pick({ guildRank: true, name: true })
export type FormSchema = typeof formSchema
