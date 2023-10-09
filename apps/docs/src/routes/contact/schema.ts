import { z } from 'zod';

export const contactFormSchema = z.object({
	name: z.string().min(3).max(100),
	email: z.string().email('Invalid email address'),
	subject: z.string().min(3).max(256),
	message: z.string().max(256, 'message must be at most 256 characters').optional()
});

export type ContactFormSchema = typeof contactFormSchema;
