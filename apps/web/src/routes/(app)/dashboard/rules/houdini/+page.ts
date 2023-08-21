import { ruleSearchSchema as schema } from '$lib/models/schema';
import { Logger } from '$lib/utils';
import { fail, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/client';
import type { AfterLoadEvent, BeforeLoadEvent, SearchSharedRules1Variables as Variables } from './$houdini';
const log = new Logger('rule.browser');

export const _SearchSharedRules1Variables: Variables = async ({ url }) => {
	log.debug('in _SearchSharedRulesVariables', { url });
	const {
		data: { limit, offset, displayName }
	} = await superValidate(url, schema);

	return {
		limit,
		offset,
		displayName: displayName ? `%${displayName}%` : '%%'
	};
};

export async function _houdini_beforeLoad({ url }: BeforeLoadEvent) {
	const form = await superValidate(url, schema);
	log.debug('in _houdini_beforeLoad', form);
	if (!form.valid) return fail(400, { form });
	// if (!form.valid) throw error(400, 'invalid input');
	return { form };
}

export async function _houdini_afterLoad({ event, input, data }: AfterLoadEvent) {
	const { url } = event;
	log.debug('in _houdini_afterLoad', { url, input, data });
	const {
		SearchSharedRules1: { rules }
	} = data;
	const form = await superValidate(url, schema);
	return {
		rules,
		form
	};
}
