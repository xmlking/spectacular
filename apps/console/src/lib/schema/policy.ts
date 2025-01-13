import {
  action_enum,
  direction_enum,
  protocol_enum,
  subject_type_enum,
  type subject_type_enum$options,
} from '$houdini';
import { z } from 'zod';

/**
 * Policy Schema
 */
export const policySchema = z.object({
  id: z.string().trim().uuid(),
  // validFrom: z.coerce.date(),
  // validFrom: z.string().datetime({ offset: true }).nullish().catch(null),
  // validTo: z.string().datetime({ offset: true }).nullish().catch(null),
  validFrom: z.date().min(new Date()).nullish(),
  validTo: z.date().nullish(),
  weight: z.coerce.number().min(0).max(1000).optional().default(1000),
  subjectDisplayName: z.string().trim().min(1),
  subjectId: z.string().trim().min(1),
  subjectSecondaryId: z.string().trim().min(1),
  subjectType: z.nativeEnum(subject_type_enum).default(subject_type_enum.user),
  active: z.boolean().optional().default(true),
  ruleId: z.string().trim().uuid(),
  rule: z.object({
    id: z.string().trim().uuid(),
    displayName: z.string().trim().min(4).max(256),
    description: z.string().trim().max(256).nullish(),
    tags: z.string().trim().min(2).array().max(5).optional().default([]),
    // metadata: z.string().trim().nullish(),
    metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
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
  }),
});

export type PolicySchema = typeof policySchema;
export type Policy = z.infer<typeof policySchema>;

/**
 * Search Policy Schema
 */
export const policySearchSchema = z.object({
  limit: z.number().int().min(5).max(100).default(10),
  offset: z.number().int().min(0).default(0),
  subjectType: z.nativeEnum(subject_type_enum).default(subject_type_enum.user),
  subjectId: z.string().trim().uuid().optional(),
  subjectDisplayName: z.string().trim().optional(),
});
export type PolicySearchSchema = typeof policySearchSchema;
export type PolicySearch = z.infer<typeof policySearchSchema>;
/**
 * Create Policy Schema
 */
export const createPolicySchema = policySchema
  .omit({
    id: true,
    // rule: {
    // 	id: true
    // }
  })
  .extend({
    ruleId: policySchema.shape.ruleId.nullish(),
    // FIXME: omit for role.id=true not working
    rule: policySchema.shape.rule.extend({
      id: policySchema.shape.rule.shape.id.optional(),
    }),
  })
  .superRefine((data, ctx) => checkValidDates(ctx, data.validFrom, data.validTo))
  .superRefine((data, ctx) => checkForMissingRule(ctx, data.ruleId, data.rule));

export type CreatePolicySchema = typeof createPolicySchema;
export type CreatePolicy = z.infer<typeof createPolicySchema>;
export const createPolicyKeys = createPolicySchema.innerType().innerType().keyof().Enum;

/**
 * Update Policy Schema
 */
export const updatePolicySchema = policySchema
  .omit({
    id: true,
    // rule: {
    // 	id: true
    // }
  })
  .extend({
    // FIXME: omit for role.id=true not working
    rule: policySchema.shape.rule.extend({
      id: policySchema.shape.rule.shape.id.optional(),
    }),
    originalShared: policySchema.shape.rule.shape.shared,
  })
  .superRefine((data, ctx) => checkValidDates(ctx, data.validFrom, data.validTo));

export type UpdatePolicySchema = typeof updatePolicySchema;
export type UpdatePolicy = z.infer<typeof updatePolicySchema>;
export const updatePolicyKeys = updatePolicySchema.innerType().keyof().Enum;

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
