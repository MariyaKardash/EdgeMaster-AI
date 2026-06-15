import { z } from 'zod';

export const entityIdSchema = z.uuid();

export const timestampSchema = z.iso.datetime();

export const baseEntitySchema = z.object({
  id: entityIdSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export type BaseEntity = z.infer<typeof baseEntitySchema>;
