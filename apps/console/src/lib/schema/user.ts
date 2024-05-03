import { z } from 'zod';
import { PUBLIC_DEFAULT_ORGANIZATION } from '$env/static/public';

export const userSchema = z.object({
	firstName: z.string({ required_error: 'First Name is required' }).min(1, { message: 'First Name is required' }).trim(),
	lastName: z.string({ required_error: 'Last Name is required' }).min(1, { message: 'Last Name is required' }).trim(),
	email: z.string({ required_error: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
	password: z.string({ required_error: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters' }).trim(),
	confirmPassword: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim(),
	//terms: z.boolean({ required_error: 'You must accept the terms and privacy policy' }),
	role: z.enum(['USER', 'PREMIUM', 'ADMIN'], { required_error: 'You must have a role' }).default('USER'),
	verified: z.boolean().default(false),
	token: z.string().optional(),
	receiveEmail: z.boolean().default(true),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	organization: z.string().default(PUBLIC_DEFAULT_ORGANIZATION)
});

export const userUpdatePasswordSchema = userSchema
	.pick({ password: true, confirmPassword: true })
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['confirmPassword']
			});
		}
	});
