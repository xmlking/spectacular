import { env as dynPriEnv } from '$env/dynamic/private';
import * as statPriEnv from '$env/static/private';
import { Logger } from '$lib/utils';
import { z } from 'zod';

const log = new Logger('lib:variables');
/**
 * To use any type besides string, you need to use zod's `coerce` method.
 */

const schema = z.object({
	// Add your private env variables here
	HASURA_GRAPHQL_ENDPOINT: z.string().url().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	AUTH_SECRET: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	NEXTAUTH_URL: z.string().url().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	AUTH_TRUST_HOST: z.coerce.boolean().default(true),
	VERCEL: z.coerce.boolean(),
	AZURE_AD_CLIENT_ID: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	AZURE_AD_CLIENT_SECRET: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	AZURE_AD_TENANT_ID: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	GITHUB_ID: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	GITHUB_SECRET: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	GOOGLE_ID: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	GOOGLE_SECRET: z.string().regex(new RegExp('^\\S*$'), {
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
		.default('https://graph.microsoft.com/.default')
});

const parsed = schema.safeParse({ ...statPriEnv, ...dynPriEnv });

if (!parsed.success) {
	// TODO: check is `building` and skip `exit` if missing environment variables?
	console.error('❌ Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 4));
	process.exit(1);
}

export default parsed.data;
