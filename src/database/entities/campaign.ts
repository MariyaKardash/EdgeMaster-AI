import { z } from 'zod';

import { baseEntitySchema } from './base';

export const campaignSchema = baseEntitySchema.extend({
  name: z.string().min(1),
  activeChapterId: z.uuid().nullable(),
});

export type Campaign = z.infer<typeof campaignSchema>;
