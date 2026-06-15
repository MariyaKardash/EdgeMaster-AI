import { z } from 'zod';

import { baseEntitySchema } from './base';
import { itemStatsSchema } from './item-stats';

export const playerItemSchema = baseEntitySchema.extend({
  playerCharacterId: z.uuid(),
  itemTemplateId: z.uuid().optional(),
  name: z.string().min(1),
  stats: itemStatsSchema,
  quantity: z.number().int().min(1).default(1),
});

export type PlayerItem = z.infer<typeof playerItemSchema>;
