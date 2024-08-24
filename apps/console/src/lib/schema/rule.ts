import { action_enum, direction_enum, protocol_enum } from '$houdini';
import { z } from 'zod';

/**
 * Rule Schema
 */
export const ruleSchema = z.object({
  id: z.string().trim().uuid(),
  displayName: z.string().trim().min(4).max(256),
  description: z.string().trim().max(256).nullish(),
  tags: z.string().trim().min(2).array().max(5).default([]),
  annotations: z.string().trim().nullish(), // TODO: validate map string
  source: z.string().ip().nullish(),
  sourcePort: z.string().trim().nullish(),
  destination: z.string().ip().nullish(),
  destinationPort: z.string().trim().nullish(),
  protocol: z.nativeEnum(protocol_enum).default(protocol_enum.Any),
  action: z.nativeEnum(action_enum).default(action_enum.block),
  direction: z.nativeEnum(direction_enum).default(direction_enum.egress),
  appId: z.string().trim().nullish(),
  throttleRate: z.coerce.number().min(0).max(100).optional().default(80),
  weight: z.coerce.number().min(0).max(1000).optional().default(1000),
  shared: z.boolean().optional().default(false),
});

export type RuleSchema = typeof ruleSchema;
export type Rule = z.infer<typeof ruleSchema>;

/**
 * Search Rule Schema
 */
export const ruleSearchSchema = z.object({
  limit: z.number().int().min(5).max(100).default(10),
  offset: z.number().int().min(0).default(0),
  displayName: z.string().trim().optional(),
  tags: z.array(z.string()).optional(),
});
export type RuleSearchSchema = typeof ruleSearchSchema;
export type RuleSearch = z.infer<typeof ruleSearchSchema>;

/**
 * Create Rule Schema
 */
export const createRuleSchema = ruleSchema.omit({ id: true });

export type CreateRuleSchema = typeof createRuleSchema;
export type CreateRule = z.infer<typeof createRuleSchema>;
export const createRuleKeys = createRuleSchema.keyof().Enum;

/**
 * Update Rule Schema
 */
export const updateRuleSchema = ruleSchema.partial().omit({ id: true }).extend({
  originalShared: ruleSchema.shape.shared,
});

export type UpdateRuleSchema = typeof updateRuleSchema;
export type UpdateRule = z.infer<typeof updateRuleSchema>;
export const updateRuleKeys = updateRuleSchema.keyof().Enum;

/**
 * Refine functions can be added here if needed
 */
