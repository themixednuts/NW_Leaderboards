import { z } from 'zod'

export const searchSchema = z.object({
  search: z.string().max(50, 'Max Length exceeded')
})

export type SearchSchema = typeof searchSchema
