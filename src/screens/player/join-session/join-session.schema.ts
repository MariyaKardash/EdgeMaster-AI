import { z } from 'zod';

export const joinSessionSchema = z.object({
  campaignName: z.string(),
});

export type JoinSessionFormValues = z.infer<typeof joinSessionSchema>;
