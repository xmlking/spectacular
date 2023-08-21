const defaultMarshall = {
	unmarshal(val) {
		return val;
	},
	marshal(val) {
		return val;
	}
};

/** @type {import('houdini').ConfigFile} */
const config = {
	watchSchema: {
		url: (env) => env.PUBLIC_GRAPHQL_ENDPOINT,
		interval: 0, //  only pull the schema when you first run `pnpm dev`
		// HINT: we need to generate scheam for highest role level that app support.
		headers: {
			'x-hasura-admin-secret': 'env:HASURA_GRAPHQL_ADMIN_SECRET',
			'x-hasura-allowed-roles': 'user manager',
			'x-hasura-role': 'manager'
		}
	},
	plugins: {
		// 'houdini-plugin-svelte-global-stores': {
		// 	generate: 'all'
		// },
		'houdini-svelte': {
			client: './src/lib/graphql/client'
		}
	},
	scalars: {
		DateTime: {
			// the corresponding typescript type
			type: 'Date',
			// turn the api's response into that type
			unmarshal(val) {
				return new Date(val);
			},
			// turn the value into something the API can use
			marshal(date) {
				// return date.getTime();
				return date?.toISOString();
			}
		},

		Decimal: {
			type: 'number',
			unmarshal(val) {
				return new Number(val);
			},
			marshal(number) {
				return number.toString();
			}
		},
		smallint: {
			type: 'number',
			unmarshal(val) {
				return new Number(val);
			},
			marshal(number) {
				return number.toString();
			}
		},
		URL: {
			type: 'URL',
			unmarshal(val) {
				return new URL(val);
			},
			marshal(url) {
				return url.toString();
			}
		},
		hstore: {
			type: 'string',
			unmarshal(val) {
				return Object.entries(val)
					.map(([k, v]) => `"${k}" => "${v}"`)
					.join(', ');
			},
			marshal(val) {
				return val;
			}
		},
		// FIXME: https://github.com/hasura/graphql-engine/issues/348
		// hstore: {
		// 	type: 'Map',
		// 	unmarshal(val) {
		// 		console.log('in hstore unmarshal', val, typeof val);
		// 		return new Map(Object.entries(val));
		// 	},
		// 	marshal(val) {
		// 		console.log('in hstore marshal', val, typeof val);
		// return Object.entries(JSON.parse(val))
		// 	.map(([k, v]) => `"${k}" => "${v}"`)
		// 	.join(', ');
		// 	}
		// },
		uuid: {
			type: 'string',
			...defaultMarshall
		},
		jsonb: {
			type: 'object',
			...defaultMarshall
		},
		timestamp: {
			type: 'Date',
			unmarshal(val) {
				return new Date(val);
			},
			marshal(date) {
				return date?.toISOString();
			}
		},
		timestamptz: {
			type: 'Date',
			unmarshal(val) {
				// TODO: https://www.tutorialspoint.com/how-to-convert-utc-date-time-into-local-date-time-using-javascript
				// const server = new Date(val);
				// const offset = server.getTimezoneOffset();
				// return new Date(server.getTime() + offset * 60000);
				return new Date(val);
			},
			marshal(date) {
				return date?.toISOString();
			}
		}
	}
};

export default config;
