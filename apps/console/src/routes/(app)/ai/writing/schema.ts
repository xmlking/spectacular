import { z } from 'zod';

export const writingSchema = z.object({
  content: z
    .string({ required_error: 'The Content is required' })
    .min(10, { message: 'Content contain at least 10 character(s)' })
    .trim(),
});
