import { z } from 'zod';

export const organizationsSchema = z.object({
  organization: z.string().trim().min(2),
  description: z.string().trim().max(256).min(2),
  allowedEmails: z.string().email().array().nullish(),
  allowedEmailDomains: z.string().trim().min(2).array().nullish(),
});

export type organizationsSchema = typeof organizationsSchema;
export type organizations = z.infer<typeof organizationsSchema>;

export const updateOrganizationsSchema = organizationsSchema;

export type UpdateOrganizationsSchema = typeof updateOrganizationsSchema;
export type UpdateOrganizations = z.infer<typeof updateOrganizationsSchema>;
export const updateOrganizationsKeys = updateOrganizationsSchema.keyof().Enum;

export const organizationsCreateSchema = organizationsSchema.extend({
  allowedEmails: z.string().email().array().default([]),
  allowedEmailDomains: z.string().trim().min(2).array().nullish().default([]),
});

export type organizationsCreateSchema = typeof organizationsCreateSchema;
