import { z } from 'zod';

export const itemStatsSchema = z.object({
  str: z.number().int().optional(),
  dex: z.number().int().optional(),
  int: z.number().int().optional(),
});

export type ItemStats = z.infer<typeof itemStatsSchema>;
