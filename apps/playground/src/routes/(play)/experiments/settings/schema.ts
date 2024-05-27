import { z } from 'zod';

export const languages = ['en', 'es', 'fr'] as const;
export const themes = ['light', 'dark'] as const;
export const allergies = ['peanuts', 'dairy', 'gluten', 'soy', 'shellfish'] as const;

// Define outside the load function so the adapter can be cached
export const schema = z.object({
  email: z.string().email(),
  bio: z.string().optional(),
  theme: z.enum(themes).default('dark'),
  language: z.enum(languages).default('en'),
  marketingEmails: z.boolean().default(true),
  allergies: z.enum(allergies).array().default([]),
});

export const simpleFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  email: z.string().email('Invalid email address'),
  notifications: z
    .enum(['all', 'mentions', 'none'], {
      required_error: 'You need to select a notification type',
    })
    .default('all'),
  bio: z.string().max(250, 'Bio must be at most 250 characters').optional(),
  website: z.string().url('Invalid URL').optional(),
  terms: z
    .boolean()
    .default(false)
    .refine((v) => v === true, {
      message: 'You need to accept the terms and conditions',
    }),
});
