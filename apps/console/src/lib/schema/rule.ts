// $lib/schema/rule.ts
import { z } from 'zod';

export const ruleSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1).max(255),
  description: z.string().optional(),
  source: z.string().optional(),
  sourcePort: z.string().optional(),
  destination: z.string().optional(),
  destinationPort: z.string().optional(),
  protocol: z.enum(['TCP', 'UDP', 'ICMP', 'Any']).default('Any'),
  action: z.enum(['Allow', 'Deny']).default('Deny'),
  direction: z.enum(['Inbound', 'Outbound']).default('Inbound'),
  appId: z.string().optional(),
  throttleRate: z.number().min(0).max(100).optional(),
  weight: z.number().min(0).max(1000).optional(),
  shared: z.boolean().default(false),
  updatedAt: z.date().optional(),
});

export type Rule = z.infer<typeof ruleSchema>;

export const ruleSearchSchema = z.object({
  displayName: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

export type RuleSearch = z.infer<typeof ruleSearchSchema>;
