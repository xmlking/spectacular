import { action_enum, direction_enum, protocol_enum } from '$houdini';
import { z } from 'zod';

export const allowedMetadata = {
  name: ["John", "Jane", "Alice", "Bob"] as const,
  age: [20, 25, 30, 35] as const,
  active: [true, false] as const,
  city: ["New York", "Los Angeles", "Chicago", "Houston"] as const,
  country: ["USA", "Canada", "UK", "India"] as const,
} as const;

/**
 * Rule Schema
 */
export const ruleSchema = z.object({
  id: z.string().trim().uuid(),
  displayName: z.string().trim().min(4).max(256),
  description: z.string().trim().max(256).nullish(),
  tags: z.string().trim().min(2).array().max(5).nullish(),
  metadata: z.record(z.string(), z.string()).nullish(),
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
export const searchRuleSchema = z.object({
  limit: z.number().int().min(5).max(100).default(10),
  offset: z.number().int().min(0).default(0),
  shared: z.boolean().optional(),
  displayName: z.string().trim().optional(),
});
export type RuleSearchSchema = typeof searchRuleSchema;
export type RuleSearch = z.infer<typeof searchRuleSchema>;
/**
 * Create Rule Schema
 */
export const createRuleSchema = ruleSchema.omit({
  id: true,
  // rule: {
  // 	id: true
  // }
});

export type CreateRuleSchema = typeof createRuleSchema;
export type CreateRule = z.infer<typeof createRuleSchema>;
export const createRuleKeys = createRuleSchema.keyof().Enum;

/**
 * Update Rule Schema
 */
export const updateRuleSchema = ruleSchema.omit({
  id: true,
  // rule: {
  // 	id: true
  // }
});

export type UpdateRuleSchema = typeof updateRuleSchema;
export type UpdateRule = z.infer<typeof updateRuleSchema>;
export const updateRuleKeys = updateRuleSchema.keyof().Enum;

/**
 * Refine functions
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function checkValidStringDates(
  ctx: z.RefinementCtx,
  validFrom: string | undefined | null,
  validTo: string | undefined | null,
) {
  if (validFrom && validTo && new Date(validTo) < new Date(validFrom)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['validTo'],
      message: 'validTo should be after validFrom',
    });
  }
}

function checkValidDates(ctx: z.RefinementCtx, validFrom: Date | undefined | null, validTo: Date | undefined | null) {
  if (validFrom && validTo && validTo < validFrom) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['validTo'],
      message: 'validTo should be after validFrom',
    });
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkForMissingRule(ctx: z.RefinementCtx, ruleId: string | undefined | null, rule: any) {
  if (ruleId == null && rule == null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['ruleId'],
      message: 'Rule is required',
    });
  }
}
