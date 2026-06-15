import { z } from 'zod';

import { baseEntitySchema } from './base';
import { itemStatsSchema } from './item-stats';

export const itemHistoryActionSchema = z.enum(['acquired', 'removed', 'modified']);

export const itemHistoryEntrySchema = baseEntitySchema.extend({
  playerCharacterId: z.uuid(),
  itemTemplateId: z.uuid().optional(),
  itemName: z.string().min(1),
  action: itemHistoryActionSchema,
  stats: itemStatsSchema.optional(),
});

export type ItemHistoryAction = z.infer<typeof itemHistoryActionSchema>;
export type ItemHistoryEntry = z.infer<typeof itemHistoryEntrySchema>;
