import { z } from 'zod';
import { building } from '$app/environment';
import { env as dynPriEnv } from '$env/dynamic/private';
import * as statPriEnv from '$env/static/private';
import { booleanSchema } from '$lib/utils/zod.utils';

/**
 * To use any type besides string, you need to use zod's `coerce` method.
 */

const schema = z.object({
	// Add your private env variables here
	HASURA_GRAPHQL_JWT_SECRET_KEY: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	VERCEL: z.coerce.boolean(),
	AUTH_PROVIDER_AZUREAD_CLIENT_ID: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	AUTH_PROVIDER_AZUREAD_CLIENT_SECRET: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	AUTH_PROVIDER_AZUREAD_TENANT: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	AUTH_PROVIDER_GITHUB_CLIENT_ID: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	AUTH_PROVIDER_GITHUB_CLIENT_SECRET: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	AUTH_PROVIDER_GOOGLE_CLIENT_ID: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	AUTH_PROVIDER_GOOGLE_CLIENT_SECRET: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	DIRECTORY_FILTER_USER_SUFFIX: z
		.string()
		.regex(new RegExp('^\\S*$'), {
			message: 'No spaces allowed'
		})
		.optional(),
	DIRECTORY_FILTER_GROUP_PREFIX: z
		.string()
		.regex(new RegExp('^\\S*$'), {
			message: 'No spaces allowed'
		})
		.optional(),
	DIRECTORY_FILTER_DEVICE_PREFIX: z
		.string()
		.regex(new RegExp('^\\S*$'), {
			message: 'No spaces allowed'
		})
		.optional(),
	MICROSOFT_GRAPH_ENDPOINT: z.string().url().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	MICROSOFT_GRAPH_TENANT_ID: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	MICROSOFT_GRAPH_CLIENT_ID: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	MICROSOFT_GRAPH_CLIENT_SECRET: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	MICROSOFT_GRAPH_SCOPES: z
		.string()
		.regex(new RegExp('^\\S*$'), {
			message: 'No spaces allowed'
		})
		.default('https://graph.microsoft.com/.default'),
	FEATURE_ENABLE_PASSWORD_LOGIN: booleanSchema,
	FEATURE_ENABLE_AZURE_LOGIN: booleanSchema
});

const parsed = schema.safeParse({ ...statPriEnv, ...(!building && dynPriEnv) });

if (!parsed.success) {
	// TODO: check is `building` and skip `exit` if missing environment variables?
	console.error(
		'❌ Invalid environment variables:',
		JSON.stringify(parsed.error.format(), null, 4)
	);
	process.exit(1);
}

console.info('FEATURE_FLAGS', {
	enablePasswordLogin: parsed.data.FEATURE_ENABLE_PASSWORD_LOGIN,
	enableAzureLogin: parsed.data.FEATURE_ENABLE_AZURE_LOGIN
});

export default parsed.data;
