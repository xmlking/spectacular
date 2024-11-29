import { z } from 'zod';

export const personSchema = z.object({
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  email: z.string().nullish(),
  line1: z.string().nullish(),
  line2: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zip: z.string().nullish(),
  country: z.string().nullish(),
});

export type Person = z.infer<typeof personSchema>;
