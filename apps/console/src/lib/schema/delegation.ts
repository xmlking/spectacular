import { z } from 'zod';
export const userSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().trim().min(4).max(256),
  email: z.string().email().nullish(),
  defaultRole: z.string().trim().min(2),
  defaultOrg: z.string().trim().min(2),
});
/**
 * Update Rule Schema
 */
export const updateUserSchema = userSchema.omit({
  id: true,
});
export type UpdateUserSchema = typeof updateUserSchema;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export const updateUserKeys = updateUserSchema.keyof().Enum;
