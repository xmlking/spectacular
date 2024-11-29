import type { JSONSchema } from 'sveltekit-superforms';

// The schema should be defined outside the load function
// This is very important to make caching work
export const personSchema = {
  type: 'object',
  description: 'Person schema with US address, phone number and email',
  properties: {
    firstName: { type: 'string', default: '', minLength: 3 },
    lastName: { type: 'string', default: '', minLength: 2 },
    email: { type: 'string', format: 'email' },
    phoneNumber: { type: 'string', format: 'phone', minLength: 5 },
    line1: {
      type: 'string',
      description: 'a string at least 5 character(s) long',
      minLength: 5,
    },
    line2: {
      type: 'string',
      description: 'a string at least 5 character(s) long',
      minLength: 5,
    },
    city: { type: 'string', default: '', minLength: 2 },
    state: { type: 'string', default: '', minLength: 2 },
    zip: { type: 'string', default: '', minLength: 5 },
    country: { type: 'string', default: '', minLength: 2 },
  },
  required: ['firstName', 'lastName', 'phoneNumber', 'line1', 'city', 'state'],
  additionalProperties: false,
  $schema: 'http://json-schema.org/draft-07/schema#',
} as const satisfies JSONSchema;
