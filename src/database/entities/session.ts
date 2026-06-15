import { z } from 'zod';

import { baseEntitySchema } from './base';

export const sessionStatusSchema = z.enum(['active', 'ended']);

export const sessionSchema = baseEntitySchema.extend({
  campaignId: z.uuid(),
  chapterId: z.uuid(),
  sessionCode: z.string().min(1),
  topicHex: z.string().min(1),
  status: sessionStatusSchema,
});

export type SessionStatus = z.infer<typeof sessionStatusSchema>;
export type Session = z.infer<typeof sessionSchema>;
