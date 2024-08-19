import { z } from 'zod';
import { action_enum, direction_enum, protocol_enum } from '$houdini';

export const ruleSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1).max(255),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  annotations: z.string().optional(),
  source: z.string().optional(),
  sourcePort: z.string().optional(),
  destination: z.string().optional(),
  destinationPort: z.string().optional(),
  protocol: z.nativeEnum(protocol_enum).default(protocol_enum.Any),
  action: z.nativeEnum(action_enum).default(action_enum.block),
  direction: z.nativeEnum(direction_enum).default(direction_enum.egress),
  appId: z.string().optional(),
  throttleRate: z.number().min(0).max(100).optional(),
  weight: z.number().min(0).max(1000).optional(),
  shared: z.boolean().default(false),
  updatedAt: z.date().optional(),
});

export const createRuleSchema = ruleSchema.omit({ id: true, updatedAt: true });
export const updateRuleSchema = ruleSchema.partial().omit({ id: true });

export const ruleSearchSchema = z.object({
  displayName: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

export type Rule = z.infer<typeof ruleSchema>;
export type CreateRule = z.infer<typeof createRuleSchema>;
export type UpdateRule = z.infer<typeof updateRuleSchema>;
export type RuleSearch = z.infer<typeof ruleSearchSchema>;

export const createRuleKeys = createRuleSchema.keyof().Enum;
export const updateRuleKeys = updateRuleSchema.keyof().Enum;
