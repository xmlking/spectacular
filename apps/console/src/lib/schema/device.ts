import { z } from 'zod';

export const deviceSchema = z.object({
  id: z.string().trim().uuid(),
  ip: z.string().trim(),
  displayName: z.string().trim().min(4).max(256),
  description: z.string().trim().max(256).nullish(),
  tags: z.string().trim().min(2).array().max(5).nullish(),
  annotations: z.string().trim().nullish(),
  version: z.string().nullish(),
});

export type DeviceSchema = typeof deviceSchema;
export type Device = z.infer<typeof deviceSchema>;
export const deviceKeys = deviceSchema.keyof().Enum;

/**
 * Search Device Schema
 */
export const deviceSearchSchema = z.object({
  displayName: z.string().trim().min(3).max(100).optional(),
  limit: z.number().int().min(5).max(1000000).default(1000000),
  offset: z.number().int().min(0).default(0),
  tags: z.array(z.string()).optional(),
});
export type DeviceSearchSchema = typeof deviceSearchSchema;
export type DeviceSearch = z.infer<typeof deviceSearchSchema>;


