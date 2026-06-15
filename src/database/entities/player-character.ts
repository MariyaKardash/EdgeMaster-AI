import { z } from 'zod';

import { baseEntitySchema } from './base';
import { characterStatsSchema } from './character-stats';

export const playerCharacterSchema = baseEntitySchema.extend({
  playerId: z.uuid(),
  characterTemplateId: z.uuid(),
  stats: characterStatsSchema,
});

export type PlayerCharacter = z.infer<typeof playerCharacterSchema>;
