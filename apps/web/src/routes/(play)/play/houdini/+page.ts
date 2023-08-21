import { order_by } from '$houdini';
import { Logger } from '$lib/utils';
import { zfd } from '$lib/zodfd';
import { error } from '@sveltejs/kit';
import { ZodError } from 'zod';
import type { BeforeLoadEvent, ListPolicies2Variables as Variables } from './$houdini';
import { policySearchSchema } from './policy.search.schema';
const log = new Logger('providers.browser');

// TODO: no need for Variables function with v1.0.0
export const _ListPolicies2Variables: Variables = ({ url }) => {
	const limit = parseInt(url.searchParams.get('limit') ?? '');
	const offset = parseInt(url.searchParams.get('offset') ?? '');

	const orderBy = [{ updated_at: order_by.desc_nulls_first }];
	return {
		limit,
		offset,
		orderBy
	};
};

const searchSchema = zfd.formData(policySearchSchema, { empty: 'strip' });

export function _houdini_beforeLoad({ url }: BeforeLoadEvent) {
	try {
		const { limit, offset, orderBy, displayNme } = searchSchema.parse(url.searchParams);
		log.debug(limit, offset, orderBy, displayNme);
	} catch (err) {
		if (err instanceof ZodError) {
			const { formErrors, fieldErrors } = err.flatten();
			return { formErrors, fieldErrors };
		} else {
			log.error('search:_houdini_beforeLoad:', err);
			throw error(500, err as Error);
		}
	}
}
