import { z } from 'zod';
export const allowedMetadata = {
  group: ['John', 'Jane', 'Alice', 'Bob'] as const,
  active: [true, false] as const,
  city: ['New York', 'Los Angeles', 'Chicago', 'Houston'] as const,
  country: ['USA', 'Canada', 'UK', 'India'] as const,
} as const;

/**
 * General Group Schema
 */
export const groupSchema = z.object({
  id: z.string().trim().uuid(),
  displayName: z.string().trim().min(4).max(256),
  description: z.string().trim().min(4).max(256).nullish(),
  tags: z.string().trim().min(2).array().max(5).nullish(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).nullish(),
});

export type GroupSchema = typeof groupSchema;
export type Group = z.infer<typeof groupSchema>;

/**
 * Search Group Schema
 */
export const searchGroupSchema = z.object({
  limit: z.number().int().min(5).max(100).default(10),
  offset: z.number().int().min(0).default(0),
  displayName: z.string().trim().min(3).optional(),
  organization: z.string().trim().min(3).optional(),
});

export type SearchGroupSchema = typeof searchGroupSchema;
export type searchGroup = z.infer<typeof searchGroupSchema>;
export const searchGroupKeys = searchGroupSchema.keyof().enum;

/**
 * Create Group Schema
 */
export const createGroupSchema = groupSchema.omit({
  id: true,
});

export type CreateGroupSchema = typeof createGroupSchema;
export type CreateGroup = z.infer<typeof createGroupSchema>;
export const createGroupKeys = createGroupSchema.keyof().enum;

/**
 * Update Policy Schema
 */
export const updateGroupSchema = groupSchema.omit({
  id: true,
});

export type UpdateGroupSchema = typeof updateGroupSchema;
export type UpdateGroup = z.infer<typeof updateGroupSchema>;
export const updateGroupKeys = updateGroupSchema.keyof().enum;
