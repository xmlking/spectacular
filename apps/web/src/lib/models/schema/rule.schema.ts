import { z } from 'zod';

/**
 * Rule Schema
 */
export const ruleSchema = z.object({
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
	shared: z.boolean().optional().default(true)
});

export type RuleSchema = typeof ruleSchema;
export type Rule = z.infer<typeof ruleSchema>;

/**
 * Create Rule Schema
 */
export const createRuleSchema = ruleSchema
	.omit({
		id: true
	})
	.extend({
		// shared: z.literal(true)
	});
export type CreateRuleSchema = typeof createRuleSchema;
export type CreateRule = z.infer<typeof createRuleSchema>;
export const createRuleKeys = createRuleSchema.keyof().Enum;

/**
 * Update Rule Schema
 */
export const updateRuleSchema = ruleSchema
	.omit({
		id: true
	})
	.extend({
		// shared: z.literal(true)
	});

export type UpdateRuleSchema = typeof updateRuleSchema;
export type UpdateRule = z.infer<typeof updateRuleSchema>;
export const updateRuleKeys = updateRuleSchema.keyof().Enum;

/**
 * Delete Rule  Schema
 */
export const ruleDeleteSchema = z.object({
	id: z.string().trim().uuid()
});

/**
 * Search Rule Schema
 */
export const ruleSearchSchema = z.object({
	displayName: z.string().trim().min(3).max(100).optional(),
	limit: z.number().int().min(5).max(100).default(10),
	offset: z.number().int().min(0).default(0)
});
