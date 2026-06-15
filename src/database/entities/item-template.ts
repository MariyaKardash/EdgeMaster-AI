import { z } from 'zod';

import { baseEntitySchema } from './base';
import { itemStatsSchema } from './item-stats';

export const itemTemplateSchema = baseEntitySchema.extend({
  campaignId: z.uuid(),
  name: z.string().min(1),
  description: z.string(),
  stats: itemStatsSchema,
});

export type ItemTemplate = z.infer<typeof itemTemplateSchema>;
