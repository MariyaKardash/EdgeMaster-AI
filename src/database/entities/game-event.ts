import { z } from 'zod';

import { baseEntitySchema } from './base';

export const gameEventTypeSchema = z.enum(['event', 'info']);

export const gameEventSchema = baseEntitySchema.extend({
  chapterId: z.uuid(),
  type: gameEventTypeSchema,
  title: z.string().min(1),
  body: z.string(),
});

export type GameEventType = z.infer<typeof gameEventTypeSchema>;
export type GameEvent = z.infer<typeof gameEventSchema>;
