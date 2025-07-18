import { z } from 'zod';

export const personSchema = z.object({
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  phoneNumber: z.string().nullish().describe('USA phone number'),
  email: z.string().nullish(),
  line1: z.string().optional().describe('USA Address street line 1'),
  line2: z.string().optional().describe('USA Address street line 2'),
  city: z.string().nullish().describe('USA City'),
  state: z.string().nullish().describe('USA State'),
  zip: z.string().nullish(),
  country: z.string().nullish(),
});

export const personJsonSchema = z.toJSONSchema(personSchema);

export type Person = z.infer<typeof personSchema>;
