import { emptyToNull } from '$lib/utils/zod.utils';
import { z } from 'zod';

function checkValidDates(ctx: z.RefinementCtx, validFrom: string | undefined | null, validTo: string | undefined | null) {
	if (validFrom && validTo && new Date(validTo) < new Date(validFrom)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['validTo'],
			message: 'validTo should be after validFrom'
		});
	}
}

export const policyClientSchema = z
	.object({
		displayName: z.string().trim().min(4).max(256),
		description: z.string().trim().max(256).nullish(),
		// tags: z.preprocess(stringToArray, z.array(z.string().trim().min(2)).optional()),
		tags: z.string().trim().min(2).array().nullish(),
		// annotations: z.preprocess(stringToJSON, z.record(z.string().trim().min(3), z.string().trim().min(3)).nullish()),
		// annotations: z.preprocess(stringToMap, z.map(z.string().trim().min(3), z.string().trim().min(3))).nullish(),
		annotations: z.string().trim().nullish(), // TODO: validate map string
		active: z.boolean().optional().default(true),
		shared: z.boolean().optional().default(false),
		// validFrom: z.string().datetime({ offset: true }).nullish().catch(null),
		// validTo: z.string().datetime({ offset: true }).nullish().catch(null),
		validFrom: z.preprocess(emptyToNull, z.string().datetime({ offset: true }).nullish()),
		validTo: z.preprocess(emptyToNull, z.string().datetime({ offset: true }).nullish()),
		source: z.string().ip().nullish(),
		sourcePort: z.string().trim().nullish(),
		destination: z.string().ip().nullish(),
		destinationPort: z.string().trim().nullish(),
		protocol: z.enum(['Any', 'IP', 'ICMP', 'IGMP', 'TCP', 'UDP', 'IPV6', 'ICMPV6', 'RM']).default('Any'),
		action: z.enum(['permit', 'block']).default('block'),
		direction: z.enum(['egress', 'ingress']).default('egress'),
		appId: z.string().trim().nullish(),
		weight: z.coerce.number().min(0).max(2000).optional().default(1000),
		id: z.string().trim().uuid().optional()
	})
	.superRefine((data, ctx) => checkValidDates(ctx, data.validFrom, data.validTo));

export const policyBaseSchema = z.object({
	displayName: z.string().trim().min(4).max(256),
	description: z.string().trim().max(256).nullish(),
	// TODO: validate comma separated string /^\w(\s*,?\s*\w)*$/
	tags: z
		.string()
		.trim()
		.regex(/^\w+(,\w+)*$/)
		.nullish(),
	// annotations: z.preprocess(stringToJSON, z.record(z.string().trim().min(3), z.string().trim().min(3)).nullish()),
	// annotations: z.preprocess(stringToMap, z.map(z.string().trim().min(3), z.string().trim().min(3)).nullish()),
	annotations: z.string().trim().nullish(), // TODO: validate map string
	active: z.coerce.boolean().optional().default(true),
	validFrom: z.string().datetime({ offset: true }).nullish().catch(null),
	// validFrom: z.string().datetime({ offset: true }).nullish()
	// 	.catch((ctx) => {
	// 		ctx.error; // ZodError
	// 		return null;
	// 	}),
	validTo: z.string().datetime({ offset: true }).nullish().catch(null),
	source: z.string().ip().nullish(),
	sourcePort: z.string().trim().nullish(),
	destination: z.string().ip().nullish(),
	destinationPort: z.string().trim().nullish(),
	protocol: z.enum(['Any', 'IP', 'ICMP', 'IGMP', 'TCP', 'UDP', 'IPV6', 'ICMPV6', 'RM']),
	action: z.enum(['permit', 'block']),
	direction: z.enum(['egress', 'ingress']),
	appId: z.string().trim().nullish(),
	weight: z.coerce.number().min(0).max(2000).catch(1000)
});

export const policyCreateBaseSchema = policyBaseSchema.extend({
	subjectDisplayName: z.string().trim(),
	subjectId: z.string().trim(),
	subjectSecondaryId: z.string().trim(),
	subjectType: z.enum(['user', 'group', 'device', 'service_account', 'device_pool']),
	shared: z.coerce.boolean().optional().default(false)
});

export const policyUpdateBaseSchema = policyBaseSchema.extend({
	ruleId: z.string().trim().uuid()
});

/**
 * system generated data
 */
const policyExtraSchema = z.object({
	createdAt: z.string().datetime({ offset: true }),
	createdBy: z.string(),
	updatedAt: z.string().datetime({ offset: true }),
	updatedBy: z.string(),
	deletedAt: z.string().datetime({ offset: true }).nullish()
});

/**
 * for search time validation
 */
export const policySearchSchema = z.object({
	limit: z.coerce.number().min(1).max(100).default(10),
	offset: z.coerce.number().min(0).default(0),
	// TODO use enum
	subjectType: z.enum(['user', 'group', 'device', 'service_account', 'device_pool']).optional(),
	subjectId: z.string().trim().uuid().optional()
});

/**
 * for update time validation
 */
export const policyUpdateSchema = policyUpdateBaseSchema.superRefine((data, ctx) => checkValidDates(ctx, data.validFrom, data.validTo));

/**
 * for create time validation
 */
export const policyCreateSchema = policyCreateBaseSchema.superRefine((data, ctx) => checkValidDates(ctx, data.validFrom, data.validTo));

/**
 * for delete time validation
 */
export const policyDeleteSchema = z.object({
	id: z.string().trim().uuid()
});

/**
 * for API return value validation and to extract the inferred type
 */
export const policySchema = policyCreateBaseSchema.merge(policyExtraSchema);

export type Policy = z.infer<typeof policySchema>;
