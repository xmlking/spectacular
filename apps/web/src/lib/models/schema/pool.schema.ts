import { z } from 'zod';

/**
 * Pool Schema
 */
export const poolSchema = z.object({
	id: z.string().trim().uuid(),
	displayName: z.string().trim().min(4).max(256),
	description: z.string().trim().max(256).nullish(),
	tags: z.string().trim().min(2).array().max(5).nullish(),
	annotations: z.string().trim().nullish() // TODO: validate map string
});

export type PoolSchema = typeof poolSchema;
export type Pool = z.infer<typeof poolSchema>;

/**
 * Create Pool Schema
 */
export const poolCreateSchema = poolSchema
	.omit({
		id: true
	})
	.extend({
		// shared: z.literal(true)
	});

export type CreatePoolSchema = typeof poolCreateSchema;
export type CreatePool = z.infer<typeof poolCreateSchema>;
export const createPoolKeys = poolCreateSchema.keyof().Enum;

/**
 * Update Pool Schema
 */
export const poolUpdateSchema = poolSchema
	.omit({
		id: true
	})
	.extend({
		// shared: z.literal(true)
	});

export type UpdatePoolSchema = typeof poolUpdateSchema;
export type UpdatePool = z.infer<typeof poolUpdateSchema>;
export const updatePoolKeys = poolUpdateSchema.keyof().Enum;

/**
 * Delete Pool Schema
 */
export const poolDeleteSchema = z.object({
	id: z.string().trim().uuid()
});

/**
 * Search Pool Schema
 */
export const poolSearchSchema = z.object({
	displayName: z.string().trim().min(3).max(100).optional(),
	limit: z.number().int().min(5).max(100).default(10),
	offset: z.number().int().min(0).default(0)
});
