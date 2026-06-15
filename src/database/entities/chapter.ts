import { z } from 'zod';

import { baseEntitySchema } from './base';

export const chapterStatusSchema = z.enum(['draft', 'active', 'completed']);

export const chapterGenerationSourceSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('manual') }),
  z.object({
    type: z.literal('prompt'),
    prompt: z.string().min(1),
  }),
  z.object({
    type: z.literal('voice'),
    transcript: z.string().min(1),
  }),
  z.object({
    type: z.literal('document'),
    documentName: z.string().min(1),
    contentRef: z.string().optional(),
  }),
]);

export const chapterSchema = baseEntitySchema.extend({
  campaignId: z.uuid(),
  title: z.string().min(1),
  description: z.string(),
  order: z.number().int().min(0),
  status: chapterStatusSchema,
  summary: z.string().optional(),
  generationSource: chapterGenerationSourceSchema.optional(),
});

export type ChapterStatus = z.infer<typeof chapterStatusSchema>;
export type ChapterGenerationSource = z.infer<typeof chapterGenerationSourceSchema>;
export type Chapter = z.infer<typeof chapterSchema>;
