import { z } from 'zod';

import { isValidSessionCode } from '@/database/utils/session-code';

export const joinSessionSchema = z.object({
  sessionCode: z
    .string()
    .trim()
    .refine(isValidSessionCode, 'Enter a valid session code (4-12 letters or numbers).'),
});

export type JoinSessionFormValues = z.infer<typeof joinSessionSchema>;
