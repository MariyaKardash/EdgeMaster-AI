import { z } from 'zod';

export const campaignSetupStep1Schema = z.object({
  campaignName: z.string().trim().min(1, 'Campaign name is required'),
  description: z.string(),
});

export type CampaignSetupStep1SchemaValues = z.infer<typeof campaignSetupStep1Schema>;
