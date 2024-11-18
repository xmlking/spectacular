import { z } from 'zod';

export const aiSchema = z.object({
  writing1: z
    .string({ required_error: 'Third Comment is required' })
    .min(10, { message: 'Third Comment contain at least 10 character(s)' })
    .trim(),
});
