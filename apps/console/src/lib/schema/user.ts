import { ROUTE_DASHBOARD } from '$lib/constants';
import { Roles } from '$lib/types';
import { z } from 'zod';

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
    .string({ required_error: 'First Name is required' })
    .regex(asciiRegex, 'Only ASCII characters are allowed')
    .min(2, { message: 'First Name must contain at least 2 character(s)' })
    .max(256)
    .trim(),
  lastName: z
    .string({ required_error: 'Last Name is required' })
    .regex(asciiRegex, 'Only ASCII characters are allowed')
    .min(2, { message: 'Last Name must contain at least 2 character(s)' })
    .max(256)
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .max(256)
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(9, { message: 'Password must be at least 9 characters' })
    .max(256)
    .trim(),
  confirmPassword: z
    .string({ required_error: 'Confirm Password is required' })
    .min(9, { message: 'Confirm Password must be at least 9 characters' })
    .max(256)
    .trim(),
  terms: z
    .literal<boolean>(true, { errorMap: () => ({ message: 'Please accept Terms of Service to continue' }) })
    .default(false),
  displayName: z
    .string({ required_error: 'Display Name is required' })
    .min(2, { message: 'Display Name must contain at least 2 character(s)' })
    .max(256)
    .trim(),
  phoneNumber: z.string().regex(phoneRegex, 'Invalid Number!').min(10).max(15).nullable(),
  avatarUrl: z.string().url().nullable(),
  defaultRole: z.nativeEnum(Roles, { required_error: 'You must have a role' }).default(Roles.User),
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
export const searchUserKeys = searchUserSchema.keyof().Enum;

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
export const updateUserDetailsKeys = updateUserDetailsSchema.keyof().Enum;

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
export const signUpKeys = signUpSchema.innerType().keyof().Enum;

/**
 * Change Password Form
 */
export const changePasswordSchema = userSchema
  .pick({ password: true, confirmPassword: true })
  .superRefine((data, ctx) => checkConfirmPassword(ctx, data.confirmPassword, data.password));
export type ChangePasswordSchema = typeof changePasswordSchema;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export const changePasswordKeys = changePasswordSchema.innerType().keyof().Enum;

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
export const changeEmailKeys = changeEmailSchema.keyof().Enum;

/**
 * Add Security Key for WebAuthN Form
 */
export const webAuthnSchema = z.object({
  nickname: z
    .string({ required_error: 'Security Key nickname is required' })
    .min(2, { message: 'Security Key nickname must contain at least 2 character(s)' })
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
      message: 'Password and Confirm Password must match',
      path: ['password'],
    });
    ctx.addIssue({
      code: 'custom',
      message: 'Password and Confirm Password must match',
      path: ['confirmPassword'],
    });
  }
}

// create a new PAT token
const END_OF_YEAR = new Date(`${new Date().getFullYear()}-12-31T23:59:59`);
const ONE_YEAR_FROM_NOW = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
export const createPATSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(6, { message: 'Name must contain at least 6 character(s)' })
    .max(256)
    .trim(),
  expiresAt: z
    .date()
    .min(new Date(), { message: 'Expires date should be in the future' })
    .max(ONE_YEAR_FROM_NOW, { message: 'Lifetime max is one year' }),
  // .default(END_OF_YEAR),
});
