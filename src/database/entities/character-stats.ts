import { z } from 'zod';

export const characterStatsSchema = z.object({
  str: z.number().int().min(0),
  dex: z.number().int().min(0),
  int: z.number().int().min(0),
});

export type CharacterStats = z.infer<typeof characterStatsSchema>;
