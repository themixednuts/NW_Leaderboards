import { insertCharacterSchema } from "@/server/db/gamedata/schema";

export const visibilitySchema = insertCharacterSchema.pick({ name: true, visibility: true })
