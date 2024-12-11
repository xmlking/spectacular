import { z } from 'zod';

export const organization = z.object({
  id: z.string().trim().uuid(),
  displayName: z.string().trim().min(4).max(256), //.default(env.PUBLIC_DEFAULT_ORGANIZATION ?? DEFAULT_ORGANIZATION),
  description: z.string().trim().min(4).max(256).nullish(),
  tags: z.string().trim().min(2).array().max(5).nullish(),
  metadata: z.string().trim().nullish(),
  // metadata: z.record(z.string(), z.string()).nullish(),
  allowedEmails: z.string().email().array().nullish(),
  allowedEmailDomains: z.string().trim().min(2).array().nullish(),
  blockedEmails: z.string().email().array().nullish(),
  blockedEmailDomains: z.string().trim().min(2).array().nullish(),
});

export type organizationsSchema = typeof organization;
export type organizations = z.infer<typeof organization>;

export const updateOrganizationsSchema = organization;

export type UpdateOrganizationsSchema = typeof updateOrganizationsSchema;
export type UpdateOrganizations = z.infer<typeof updateOrganizationsSchema>;
export const updateOrganizationsKeys = updateOrganizationsSchema.keyof().Enum;

export const organizationsCreateSchema = organization.extend({
  allowedEmails: z.string().email().array().default([]),
  allowedEmailDomains: z.string().trim().min(2).array().nullish().default([]),
});

export type organizationsCreateSchema = typeof organizationsCreateSchema;
