import { z } from 'zod';

export const userRoleSchema = z.enum(['master', 'player']);

export type UserRole = z.infer<typeof userRoleSchema>;
