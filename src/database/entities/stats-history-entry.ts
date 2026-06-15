import { z } from 'zod';

import { baseEntitySchema } from './base';
import { characterStatsSchema } from './character-stats';

export const statsHistoryEntrySchema = baseEntitySchema.extend({
  playerCharacterId: z.uuid(),
  stats: characterStatsSchema,
  source: z.string().optional(),
});

export type StatsHistoryEntry = z.infer<typeof statsHistoryEntrySchema>;
