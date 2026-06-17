import { z } from 'zod';

import { isValidTopicHex } from '@/lib/holepunch/topicHex';

export const joinSessionSchema = z.object({
  topicHex: z.string().trim().refine(isValidTopicHex, 'Enter a valid 64-character topic hex.'),
});

export type JoinSessionFormValues = z.infer<typeof joinSessionSchema>;
