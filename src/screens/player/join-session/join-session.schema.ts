import { z } from 'zod';

import { isValidJoinInput } from '@/lib/holepunch/resolveJoinInput';

export const joinSessionSchema = z.object({
  sessionCode: z
    .string()
    .trim()
    .refine(isValidJoinInput, 'Enter a valid session code (e.g. NDFC-UJL2).'),
});

export type JoinSessionFormValues = z.infer<typeof joinSessionSchema>;
