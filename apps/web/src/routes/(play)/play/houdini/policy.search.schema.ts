import { z } from 'zod';

/**
 * for search time validation
 */
export const policySearchSchema = z.object({
	limit: z.coerce.number().min(1).max(100).default(10),
	offset: z.coerce.number().min(0).default(0),
	orderBy: z.string().min(0).default('DESC_NULLS_FIRST'),
	displayNme: z.string().min(3).default('sumo')
});
