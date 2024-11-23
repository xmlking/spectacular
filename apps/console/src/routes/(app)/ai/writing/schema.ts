import { z } from 'zod';

export const writingSchema = z.object({
  content: z
    .string({ required_error: 'The Content is required' }).trim()
    .min(10, { message: 'Content contain at least 10 character(s)' })
    .default('Write an email to my bank asking them to raise my credit limit from $1,000 to $10,000.')
});
