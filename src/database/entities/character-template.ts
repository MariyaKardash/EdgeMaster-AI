import { z } from 'zod';

import { baseEntitySchema } from './base';
import { characterStatsSchema } from './character-stats';

export const characterTemplateSchema = baseEntitySchema.extend({
  campaignId: z.uuid(),
  name: z.string().min(1),
  class: z.string().min(1),
  description: z.string(),
  stats: characterStatsSchema,
  imageUri: z.url().optional(),
});

export type CharacterTemplate = z.infer<typeof characterTemplateSchema>;
