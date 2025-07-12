import { z } from 'zod';
import { OrgRoles } from '$lib/types';

/**
 * Membership
 */
export const memberSchema = z.object({
  note: z.string().optional(),
  locale: z.enum(['en', 'es', 'de']).default('en'),
  verified: z.boolean().default(false),
  token: z.string().optional(),
  receiveEmail: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

/**
 * Member Invite Schama
 */
const inviteSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address' }),
  role: z
    .enum(OrgRoles, {
      error: (issue) => (issue.input === undefined ? 'Please select a valid role' : 'Please select a role'),
    })
    .default(OrgRoles.Member),
});

/**
 * Add Member
 */
export const addMembersSchema = z.object({
  invites: z
    .array(inviteSchema)
    .min(1, { message: 'You must include at least one Member' })
    .default([
      {
        email: '',
        role: OrgRoles.Member,
      },
    ]),
});

export type AddMembesrSchema = typeof addMembersSchema;
export type AddMembers = z.infer<typeof addMembersSchema>;
export const addMembersKeys = addMembersSchema.keyof().enum;
