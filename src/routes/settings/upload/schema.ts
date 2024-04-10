
import { z } from 'zod'

export const gameLogFormSchema = z.object({
  file: z.instanceof(File, { message: 'Please upload a file.' })
    .refine(f => /^Game.*\.log$/.test(f.name), 'Please upload Game.log or backup log file.')
    // .refine(f => f.type === 'text/x-log' || f.type === 'text/plain', 'Uploaded incorrect type of file.')
    .refine(file => file.size <= 1_000_000)
})

export type GameLogFormSchema = typeof gameLogFormSchema
