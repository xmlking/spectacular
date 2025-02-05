/// <references types="houdini-svelte">
const defaultMarshall = {
  unmarshal(val) {
    return val;
  },

  marshal(val) {
    return val;
  },
};

/** @type {import('houdini').ConfigFile} */
const config = {
  watchSchema: {
    url: (env) => env.PUBLIC_NHOST_GRAPHQL_URL,
    interval: 0, //  only pull the schema when you first run `turbo dev`
    // HINT: we need to generate scheam for highest role level that app support.
    headers: {
      'X-Hasura-Admin-Secret': (env) => env.HASURA_GRAPHQL_ADMIN_SECRET,
      'x-hasura-allowed-roles': 'user me sys:admin org:member org:admin org:billing org:owner',
    },
  },
  types: {
    memberships: {
      keys: ['userId', 'orgId'],
    },
    invitations: {
      keys: ['email', 'orgId'],
    },
    user_groups: {
      keys: ['userId', 'groupId'],
    },
  },
  features: {
    imperativeCache: true,
    runtimeScalars: {
      UserIdFromSession: {
        type: 'uuid',
        resolve: ({ session }) => session?.userId,
      },
      OrgIdFromSession: {
        type: 'uuid',
        resolve: ({ session }) => session?.orgId,
      },
    },
  },
  plugins: {
    // 'houdini-plugin-svelte-global-stores': {
    // 	generate: 'all'
    // },
    'houdini-svelte': {
      client: './src/lib/graphql/client',
    },
    '@spectacular/role-houdini': {},
  },
  scalars: {
    // ref: https://www.houdinigraphql.com/api/config#custom-scalars
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
      },
    },
    Decimal: {
      type: 'Number',
      unmarshal(val) {
        return new Number(val);
      },
      marshal(number) {
        return number.toString();
      },
    },
    smallint: {
      type: 'Number',
      unmarshal(val) {
        return new Number(val);
      },
      marshal(number) {
        return number.toString();
      },
    },
    bigint: {
      type: 'Number',
      ...defaultMarshall,
    },
    URL: {
      type: 'URL',
      unmarshal(val) {
        return new URL(val);
      },
      marshal(url) {
        return url.toString();
      },
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
      },
    },
    citext: {
      type: 'string',
      ...defaultMarshall,
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
      ...defaultMarshall,
    },
    jsonb: {
      type: 'Object',
      ...defaultMarshall,
    },
    timestamp: {
      type: 'Date',
      unmarshal(val) {
        return new Date(val);
      },
      marshal(date) {
        return date?.toISOString();
      },
    },
    timestamptz: {
      type: 'Date',
      unmarshal(val) {
        // TODO: https://www.tutorialspoint.com/how-to-convert-utc-date-time-into-local-date-time-using-javascript
        // const server = new Date(val);
        // const offset = server.getTimezoneOffset();
        // return new Date(server.getTime() + offset * 60000);
        return val ? new Date(val) : null;
      },
      marshal(date) {
        return date?.toISOString();
      },
    },
    bytea: {
      type: 'Binary',
      ...defaultMarshall,
    },
  },
};

export default config;
