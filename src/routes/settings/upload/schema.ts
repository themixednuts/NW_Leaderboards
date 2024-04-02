
import { z } from 'zod'

export const gameLogFormSchema = z.object({
  file: z.instanceof(File, { message: 'Please upload a file.' }).refine(f => f.name === 'Game.log', 'Please upload Game.log file.').refine(f => f.type === 'text/x-log', 'Uploaded incorrect type of file.')
})

export type GameLogFormSchema = typeof gameLogFormSchema
