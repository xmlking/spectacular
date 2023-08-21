import { z } from 'zod';

/**
 * Device Schema
 */
export const deviceSchema = z.object({
	id: z.string().trim().uuid(),
	ip: z.string().trim(),
	displayName: z.string().trim().min(4).max(256),
	description: z.string().trim().max(256).nullish(),
	tags: z.string().trim().min(2).array().max(5).nullish(),
	annotations: z.string().trim().nullish(),
	version: z.string().nullish()
});

export type DeviceSchema = typeof deviceSchema;
export type Device = z.infer<typeof deviceSchema>;

/**
 * Update Device Schema
 */
export const updateDeviceSchema = deviceSchema
	.omit({
		id: true
		// ip: true,
		// displayName: true,
		// version: true
	})
	.extend({
		// shared: z.literal(true)
	});

export type UpdateDeviceSchema = typeof updateDeviceSchema;
export type UpdateDevice = z.infer<typeof updateDeviceSchema>;
export const updateDeviceKeys = updateDeviceSchema.keyof().Enum;

/**
 * Delete Device Schema
 */
export const deviceDeleteSchema = z.object({
	id: z.string().trim().uuid()
});

/**
 * Search Device Schema
 */
export const deviceSearchSchema = z.object({
	displayName: z.string().trim().min(3).max(100).optional(),
	limit: z.number().int().min(5).max(100).default(10),
	offset: z.number().int().min(0).default(0)
});
