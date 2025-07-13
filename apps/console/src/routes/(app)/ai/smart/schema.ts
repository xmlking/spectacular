import { z } from 'zod';
import { SPECIALIZATIONS } from '$lib/constants';

export const aiSchema = z.object({
  commentOne: z
    .string({ error: (issue) => (issue.input === undefined ? 'First Comment is required' : 'Not a string') })
    .min(10, { message: 'First Comment must contain at least 10 character(s)' })
    .trim(),
  commentTwo: z
    .string({ error: (issue) => (issue.input === undefined ? 'Second Comment is required' : 'Not a string') })
    .min(10, { message: 'Second Comment contain at least 10 character(s)' })
    .trim(),
  commentThree: z
    .string({ error: (issue) => (issue.input === undefined ? 'Third Comment is required' : 'Not a string') })
    .min(10, { message: 'Third Comment contain at least 10 character(s)' })
    .trim(),
  startDate: z.date().min(new Date()).nullish(),
  endDate: z.date().nullish(),
  specialization: z.enum(SPECIALIZATIONS),
});
