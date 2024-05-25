import { z } from 'zod';
import { building } from '$app/environment';
import { env as dynPubEnv } from '$env/dynamic/public';
import * as statPubEnv from '$env/static/public';
import { booleanSchema } from '$lib/utils/zod.utils';

/**
 * To use any type besides string, you need to use zod's `coerce` method.
 */

const schema = z.object({
	// Add your public env variables here
	PUBLIC_BASE_URL: z.string().url().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	PUBLIC_GRAPHQL_ENDPOINT: z.string().url().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	PUBLIC_DEFAULT_ORGANIZATION: z.string().regex(new RegExp('^\\S*$'), {
		message: 'No spaces allowed'
	}),
	PUBLIC_FEATURE_ENABLE_AZURE_AD: booleanSchema
});

const parsed = schema.safeParse({ ...statPubEnv, ...(!building && dynPubEnv) });

if (!parsed.success) {
	// TODO: check is `building` and skip `exit` if missing environment variables?
	console.error('❌ Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 4));
	process.exit(1);
}
console.info('FEATURE_FLAGS', {
	enableAzureAd: parsed.data.PUBLIC_FEATURE_ENABLE_AZURE_AD
});

export default parsed.data;
