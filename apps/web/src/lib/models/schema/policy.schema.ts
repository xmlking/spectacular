import { z } from 'zod';

/**
 * Policy Schema
 */
export const policySchema = z.object({
	id: z.string().trim().uuid(),
	// validFrom: z.coerce.date(),
	// validFrom: z.string().datetime({ offset: true }).nullish().catch(null),
	// validTo: z.string().datetime({ offset: true }).nullish().catch(null),
	validFrom: z.date().nullish(),
	validTo: z.date().nullish(),
	weight: z.coerce.number().min(0).max(1000).optional().default(1000),
	subjectDisplayName: z.string().trim().nonempty(),
	subjectId: z.string().trim().nonempty(),
	subjectSecondaryId: z.string().trim().nonempty(),
	subjectType: z.enum(['user', 'group', 'device', 'service_account', 'device_pool']).default('user'),
	active: z.boolean().optional().default(true),
	ruleId: z.string().trim().uuid(),
	rule: z.object({
		id: z.string().trim().uuid(),
		displayName: z.string().trim().min(4).max(256),
		description: z.string().trim().max(256).nullish(),
		tags: z.string().trim().min(2).array().max(5).nullish(),
		// annotations: z.preprocess(stringToJSON, z.record(z.string().trim().min(3), z.string().trim().min(3)).nullish()),
		// annotations: z.preprocess(stringToMap, z.map(z.string().trim().min(3), z.string().trim().min(3))).nullish(),
		annotations: z.string().trim().nullish(), // TODO: validate map string
		source: z.string().ip().nullish(),
		sourcePort: z.string().trim().nullish(),
		destination: z.string().ip().nullish(),
		destinationPort: z.string().trim().nullish(),
		protocol: z.enum(['Any', 'IP', 'ICMP', 'IGMP', 'TCP', 'UDP', 'IPV6', 'ICMPV6', 'RM']).default('Any'),
		action: z.enum(['permit', 'block', 'callout_inspection', 'callout_terminating', 'callout_unknown']).default('block'),
		direction: z.enum(['egress', 'ingress']).default('egress'),
		appId: z.string().trim().nullish(),
		throttleRate: z.coerce.number().min(0).max(100).optional().default(80),
		weight: z.coerce.number().min(0).max(1000).optional().default(1000),
		shared: z.boolean().optional().default(false)
	})
});

export type PolicySchema = typeof policySchema;
export type Policy = z.infer<typeof policySchema>;

/**
 * Search Policy Schema
 */
export const policySearchSchema = z.object({
	limit: z.number().int().min(5).max(100).default(10),
	offset: z.number().int().min(0).default(0),
	// TODO use enum
	subjectType: z.enum(['user', 'group', 'device', 'service_account', 'device_pool']).optional(),
	subjectId: z.string().trim().uuid().optional(),
	subjectDisplayName: z.string().trim().optional()
});

/**
 * Create Policy Schema
 */
export const createPolicySchema = policySchema
	.omit({
		id: true
		// rule: {
		// 	id: true
		// }
	})
	.extend({
		ruleId: policySchema.shape.ruleId.nullish(),
		// FIXME: omit for role.id=true not working
		rule: policySchema.shape.rule.extend({
			id: policySchema.shape.rule.shape.id.optional()
		})
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
		id: true
		// rule: {
		// 	id: true
		// }
	})
	.extend({
		// FIXME: omit for role.id=true not working
		rule: policySchema.shape.rule.extend({
			id: policySchema.shape.rule.shape.id.optional()
		}),
		originalShared: policySchema.shape.rule.shape.shared
	})
	.superRefine((data, ctx) => checkValidDates(ctx, data.validFrom, data.validTo));

export type UpdatePolicySchema = typeof updatePolicySchema;
export type UpdatePolicy = z.infer<typeof updatePolicySchema>;
export const updatePolicyKeys = updatePolicySchema.innerType().keyof().Enum;

/**
 * Refine functions
 */

function checkValidStringDates(ctx: z.RefinementCtx, validFrom: string | undefined | null, validTo: string | undefined | null) {
	if (validFrom && validTo && new Date(validTo) < new Date(validFrom)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['validTo'],
			message: 'validTo should be after validFrom'
		});
	}
}

function checkValidDates(ctx: z.RefinementCtx, validFrom: Date | undefined | null, validTo: Date | undefined | null) {
	if (validFrom && validTo && validTo < validFrom) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['validTo'],
			message: 'validTo should be after validFrom'
		});
	}
}
function checkForMissingRule(ctx: z.RefinementCtx, ruleId: string | undefined | null, rule: any) {
	if (ruleId == null && rule == null) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['ruleId'],
			message: 'Rule is required'
		});
	}
}
