import { PUBLIC_DEFAULT_ORGANIZATION } from '$env/static/public';
import { z } from 'zod';

/**
 * General User Schema
 */
export const userSchema = z.object({
  firstName: z
    .string({ required_error: 'First Name is required' })
    .min(2, { message: 'First Name must contain at least 2 character(s)' })
    .max(256)
    .trim(),
  lastName: z
    .string({ required_error: 'Last Name is required' })
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
  role: z.enum(['USER', 'PREMIUM', 'ADMIN'], { required_error: 'You must have a role' }).default('USER'),
  verified: z.boolean().default(false),
  token: z.string().optional(),
  receiveEmail: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  organization: z.string().default(PUBLIC_DEFAULT_ORGANIZATION),
});

/**
 * Sign in with password
 */
export const pwSchema = userSchema
  .pick({
    email: true,
    password: true,
  })
  .extend({
    redirectTo: z.string().default('/dashboard'),
  });

/**
 * Sign in passwordless
 */
export const pwlSchema = userSchema
  .pick({
    email: true,
  })
  .extend({
    redirectTo: z.string().default('/dashboard'),
  });

/**
 * Sign Up
 */
export const signUpSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
    confirmPassword: true,
    terms: true,
    organization: true,
  })
  .extend({
    redirectTo: z.string().default('/dashboard'),
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
export const createPATSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(6, { message: 'Name must contain at least 6 character(s)' })
    .max(256)
    .trim(),
  expiryDate: z.string().date(),
});
