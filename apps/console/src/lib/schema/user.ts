import { z } from 'zod';
import { ROUTE_DASHBOARD } from '$lib/constants';
import { Roles } from '$lib/types';

export const allowedMetadata = {
  plan: ['Starter', 'Pro', 'Team', 'Family'] as const,
  active: [true, false] as const,
  zone: ['north', 'east', 'west', 'south'] as const,
  region: ['APAC', 'North America', 'South America', 'Europe', 'Middle East', 'Africa'] as const,
} as const;

// const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);
const phoneRegex = /^\+[1-9]\d{1,14}$/;
// Regular expression to match ASCII characters
// const asciiRegex = /^[\x01-\x7F]*$/; // all ascii
const asciiRegex = /^[\x20-\x7E]*$/; // printable ascii

/**
 * General User Schema
 */
export const userSchema = z.object({
  firstName: z
    .string({ error: (issue) => (issue.input === undefined ? 'First Name is required' : 'Not a string') })
    .regex(asciiRegex, 'Only ASCII characters are allowed')
    .min(2, { error: 'First Name must contain at least 2 character(s)' })
    .max(256)
    .trim(),
  lastName: z
    .string({ error: (issue) => (issue.input === undefined ? 'Last Name is required' : 'Not a string') })
    .regex(asciiRegex, 'Only ASCII characters are allowed')
    .min(2, { error: 'Last Name must contain at least 2 character(s)' })
    .max(256)
    .trim(),
  email: z
    .string({ error: (issue) => (issue.input === undefined ? 'Email is required' : 'Not a string') })
    .email({ error: 'Please enter a valid email address' })
    .max(256)
    .trim(),
  password: z
    .string({ error: (issue) => (issue.input === undefined ? 'Password is required' : 'Not a string') })
    .min(9, { error: 'Password must be at least 9 characters' })
    .max(256)
    .trim(),
  confirmPassword: z
    .string({ error: (issue) => (issue.input === undefined ? 'Confirm Password is required' : 'Not a string') })
    .min(9, { error: 'Confirm Password must be at least 9 characters' })
    .max(256)
    .trim(),
  terms: z.literal<boolean>(true, { error: 'Please accept Terms of Service to continue' }).default(false),
  displayName: z
    .string({ error: (issue) => (issue.input === undefined ? 'Display Name is required' : 'Not a string') })
    .min(2, { error: 'Display Name must contain at least 2 character(s)' })
    .max(256)
    .trim(),
  phoneNumber: z.string().regex(phoneRegex, 'Invalid Number!').min(10).max(15).nullable(),
  avatarUrl: z.string().url().nullable(),
  defaultRole: z
    .enum(Roles, { error: (issue) => (issue.input === undefined ? 'You must have a role' : 'Not a string') })
    .default(Roles.User),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).nullish(),
  locale: z.enum(['en', 'es', 'de']).default('en'),
  verified: z.boolean().default(false),
  token: z.string().optional(),
  receiveEmail: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

/**
 * Search User Schema
 */
export const searchUserSchema = z.object({
  limit: z.number().int().min(5).max(100).default(10),
  offset: z.number().int().min(0).default(0),
  displayName: z.string().trim().min(3).optional(),
});

export type SearchUserSchema = typeof searchUserSchema;
export type SearchUser = z.infer<typeof searchUserSchema>;
export const searchUserKeys = searchUserSchema.keyof().enum;

/**
 * Update User Details
 */
export const updateUserDetailsSchema = userSchema.omit({
  firstName: true,
  lastName: true,
  password: true,
  confirmPassword: true,
  terms: true,
  verified: true,
  token: true,
  receiveEmail: true,
  createdAt: true,
  updatedAt: true,
});
export type UpdateUserDetailsSchema = typeof updateUserDetailsSchema;
export type updateUserDetails = z.infer<typeof updateUserDetailsSchema>;
export const updateUserDetailsKeys = updateUserDetailsSchema.keyof().enum;

/**
 * Sign in with password
 */
export const pwSchema = userSchema
  .pick({
    email: true,
    password: true,
  })
  .extend({
    redirectTo: z.string().default(ROUTE_DASHBOARD),
  });

/**
 * Sign in magic-link
 */
export const mlSchema = userSchema
  .pick({
    email: true,
  })
  .extend({
    redirectTo: z.string().default(ROUTE_DASHBOARD),
  });

/**
 * Sign Up
 */
export const signUpSchema = userSchema
  .pick({
    locale: true,
    firstName: true,
    lastName: true,
    email: true,
    password: true,
    confirmPassword: true,
    terms: true,
  })
  .extend({
    redirectTo: z.string().default(ROUTE_DASHBOARD),
  })
  .superRefine((data, ctx) => checkConfirmPassword(ctx, data.confirmPassword, data.password));
export type SignUpSchema = typeof signUpSchema;
export type SignUp = z.infer<typeof signUpSchema>;
export const signUpKeys = signUpSchema.keyof().enum;

/**
 * Change Password Form
 */
export const changePasswordSchema = userSchema
  .pick({ password: true, confirmPassword: true })
  .superRefine((data, ctx) => checkConfirmPassword(ctx, data.confirmPassword, data.password));
export type ChangePasswordSchema = typeof changePasswordSchema;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export const changePasswordKeys = changePasswordSchema.keyof().enum;

/**
 * used in reset password in auth page
 */
export const resetPasswordSchema = userSchema.pick({ email: true });

/**
 * Change Email Form
 */
export const changeEmailSchema = userSchema.pick({ email: true });
export type ChangeEmailSchema = typeof changeEmailSchema;
export type ChangeEmail = z.infer<typeof changeEmailSchema>;
export const changeEmailKeys = changeEmailSchema.keyof().enum;

/**
 * Add Security Key for WebAuthN Form
 */
export const webAuthnSchema = z.object({
  nickname: z
    .string({ error: (issue) => (issue.input === undefined ? 'Security Key nickname is required' : 'Not a string') })
    .min(2, { error: 'Security Key nickname must contain at least 2 character(s)' })
    .max(256)
    .trim(),
});

/**
 * Refine functions
 */
function checkConfirmPassword(ctx: z.RefinementCtx, confirmPassword: string, password: string) {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: 'custom',
      error: 'Password and Confirm Password must match',
      path: ['password'],
    });
    ctx.addIssue({
      code: 'custom',
      error: 'Password and Confirm Password must match',
      path: ['confirmPassword'],
    });
  }
}

// create a new PAT token
const END_OF_YEAR = new Date(`${new Date().getFullYear()}-12-31T23:59:59`);
const ONE_YEAR_FROM_NOW = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
export const createPATSchema = z.object({
  name: z
    .string({ error: (issue) => (issue.input === undefined ? 'Name is required' : 'Not a string') })
    .min(6, { error: 'Name must contain at least 6 character(s)' })
    .max(256)
    .trim(),
  expiresAt: z
    .date()
    .min(new Date(), { error: 'Expires date should be in the future' })
    .max(ONE_YEAR_FROM_NOW, { error: 'Lifetime max is one year' }),
  // .default(END_OF_YEAR),
});
