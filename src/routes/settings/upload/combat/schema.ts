
import { z } from 'zod'

export const formSchema = z.object({
  files: z.instanceof(File, { message: 'Please upload a file.' })
    // .refine(f => /^Game.*\.log$/.test(f.name), 'Please upload combat log files.')
    // .refine(f => f.type === 'text/x-log' || f.type === 'text/plain', 'Uploaded incorrect type of file.')
    .refine(f => f.size <= 15_000_000, 'Please upload files less than 5Mb')
})

export type FormSchema = typeof formSchema
