import { z } from 'zod';

export const organization = z.object({
  organization: z.string().trim().min(2),
  description: z.string().trim().max(256).min(2),
  allowedEmails: z.string().email().array().nullish(),
  allowedEmailDomains: z.string().trim().min(2).array().nullish(),
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
