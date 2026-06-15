import { z } from 'zod';

import { baseEntitySchema } from './base';

export const playerSchema = baseEntitySchema.extend({
  sessionId: z.uuid(),
  displayName: z.string().min(1),
});

export type Player = z.infer<typeof playerSchema>;
