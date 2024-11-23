import { SPECIALIZATIONS } from '$lib/constants';
import { z } from 'zod';

export const aiSchema = z.object({
  commentOne: z
    .string({ required_error: 'First Comment is required' })
    .min(10, { message: 'First Comment must contain at least 10 character(s)' })
    .trim(),
  commentTwo: z
    .string({ required_error: 'Second Comment is required' })
    .min(10, { message: 'Second Comment contain at least 10 character(s)' })
    .trim(),
  commentThree: z
    .string({ required_error: 'Third Comment is required' })
    .min(10, { message: 'Third Comment contain at least 10 character(s)' })
    .trim(),
  startDate: z.date().nullish(),
  endDate: z.date().nullish(),
  specialization: z.enum(SPECIALIZATIONS),
});
