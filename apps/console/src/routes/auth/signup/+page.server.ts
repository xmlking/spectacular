import { fail, error } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { redirect as redirectWithFlash } from 'sveltekit-flash-message/server';
import { message, setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { Logger } from '@spectacular/utils';
import { userSchema } from '$lib/schema/user';
import { NHOST_SESSION_KEY } from '$lib/nhost';
import { limiter } from '$lib/server/limiter/limiter';
import { i18n } from '$lib/i18n';
import { env as secrets } from '$env/dynamic/private';
import { CachePolicy, ListOrganizationsStore, type ListOrganizations$result, order_by } from '$houdini';
import type { NhostClient } from '@nhost/nhost-js';

const log = new Logger('server:auth:signup');

const signUpSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true,
	password: true,
	// terms: true,
	organization: true
});

const listOrganizationsStore = new ListOrganizationsStore();
const ADMIN_SECRET = secrets.HASURA_GRAPHQL_ADMIN_SECRET;
const ORGS_QUERY = listOrganizationsStore.artifact.raw;
const ORGS_HASH = listOrganizationsStore.artifact.hash;
const cache = new Map();

async function getOrgs(nhost: NhostClient) {
	if (!cache.has(ORGS_HASH)) {
		const { data, error } = await nhost.graphql.request(
			ORGS_QUERY,
			{},
			{
				headers: {
					'X-Hasura-Admin-Secret': ADMIN_SECRET
				}
			}
		);
		if (error) {
			return { errors: error as GraphQLError[], data: null };
		}
		cache.set(ORGS_HASH, data);
	}
	return { errors: null, data: cache.get(ORGS_HASH) as ListOrganizations$result };
}

export const load = async (event) => {
	const {
		locals: { nhost }
	} = event;
	// Preflight prevents direct posting.
	// If preflight option is true and this function isn't called
	// before posting, request will be limited:
	await limiter.cookieLimiter?.preflight(event);

	const session = nhost.auth.getSession();
	// log.debug(session);
	if (session) redirectWithFlash(302, i18n.resolveRoute('/dashboard'));
	const form = await superValidate(zod(signUpSchema));

	const { errors, data } = await getOrgs(nhost);

	if (errors) {
		errors.forEach((error) => {
			log.error('list orgs api error', error);
			// NOTE: you can add multiple errors, send all along with a message
			setError(form, '', (error as GraphQLError).message);
		});
		setMessage(form, { type: 'error', message: 'List organizations failed' }, { status: 500 });
		return { status: 500, form };
	}
	const organizations = data.organizations.map((x) => x.organization);
	if (!organizations) error(404, 'organizations not found');
	return { organizations, form };
};

export const actions = {
	default: async (event) => {
		const {
			request,
			cookies,
			locals: {
				paraglide: { lang },
				nhost
			}
		} = event;

		const form = await superValidate(request, zod(signUpSchema));

		const status = await limiter.check(event);
		if (status.limited) {
			event.setHeaders({
				'Retry-After': status.retryAfter.toString()
			});
			return message(
				form,
				{
					type: 'error',
					message: `Rate limit has been reached. Please retry after ${status.retryAfter} seconds`
				},
				{ status: 429 }
			);
		}

		log.debug({ lang, nhost });
		await sleep(8000);

		if (!form.valid) return fail(400, { form });

		const { organization, firstName, lastName, email, password } = form.data;

		const { session, error } = await nhost.auth.signUp({
			email,
			password,
			options: {
				displayName: `${firstName} ${lastName}`,
				// defaultRole: 'user',
				// It's possible to give users a subset of allowed roles during signup.
				// allowedRoles: ['me', 'user'],
				locale: lang,
				metadata: {
					plan: 'free',
					default_org: organization
				}
			}
		});
		if (error) {
			log.error(error);
			return setError(form, `Failed creating account: ${error.message}`, { status: 409 }); // 424 ???
		}

		if (session) {
			cookies.set(NHOST_SESSION_KEY, btoa(JSON.stringify(session)), { path: '/' });
			const message: App.Superforms.Message = { type: 'success', message: 'Signup sucessfull 😎' } as const;
			redirectWithFlash(303, i18n.resolveRoute('/dashboard'), message, event);
		}

		// This line should never reach.
		return message(form, { type: 'success', message: 'Signup sucessfull 😎' });
	}
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
