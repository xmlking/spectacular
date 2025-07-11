import { z } from 'zod';

export const allowedMetadata = {
  group: ['John', 'Jane', 'Alice', 'Bob'] as const,
  active: [true, false] as const,
  city: ['New York', 'Los Angeles', 'Chicago', 'Houston'] as const,
  country: ['USA', 'Canada', 'UK', 'India'] as const,
} as const;

/**
 * General Organization Schema
 */
export const organizationSchema = z.object({
  id: z.string().trim().uuid(),
  displayName: z.string().trim().min(4).max(256), //.default(env.PUBLIC_DEFAULT_ORGANIZATION ?? DEFAULT_ORGANIZATION),
  description: z.string().trim().min(4).max(256).nullish(),
  tags: z.string().trim().min(2).array().max(5).nullish(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).nullish(),
  createdBy: z.string().trim().uuid(),
  updatedBy: z.string().trim().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ownerId: z.string().trim().uuid(),
  allowedEmails: z.string().email().array().nullish(),
  allowedEmailDomains: z.string().trim().min(2).array().nullish(),
  blockedEmails: z.string().email().array().nullish(),
  blockedEmailDomains: z.string().trim().min(2).array().nullish(),
  autoEnroll: z.boolean().optional().default(false),
  avatarUrl: z.string().url().nullish(),
});

export type OrganizationSchema = typeof organizationSchema;
export type Organization = z.infer<typeof organizationSchema>;

/**
 * Search Organization Schema
 */
export const searchOrganizationSchema = z.object({
  limit: z.number().int().min(5).max(100).default(10),
  offset: z.number().int().min(0).default(0),
  displayName: z.string().trim().min(3).optional(),
});

export type SearchOrganizationSchema = typeof searchOrganizationSchema;
export type SearchOrganization = z.infer<typeof searchOrganizationSchema>;
export const searchOrganizationKeys = searchOrganizationSchema.keyof().enum;

/**
 * Create Organization Schema
 */
export const createOrganizationSchema = organizationSchema.omit({
  id: true,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});

export type CreateOrganizationSchema = typeof createOrganizationSchema;
export type CreateOrganization = z.infer<typeof createOrganizationSchema>;
export const createOrganizationKeys = createOrganizationSchema.keyof().enum;

/**
 * Update Organization Schema
 */
export const updateOrganizationSchema = organizationSchema.omit({
  id: true,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
});

export type UpdateOrganizationSchema = typeof updateOrganizationSchema;
export type UpdateOrganization = z.infer<typeof updateOrganizationSchema>;
export const updateOrganizationKeys = updateOrganizationSchema.keyof().enum;
