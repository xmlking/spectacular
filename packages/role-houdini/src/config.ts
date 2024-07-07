import type { ConfigFile } from 'houdini';

/** Configure the default set of scalars supported by Hasura */
export default function config(config: ConfigFile): ConfigFile {
  return {
    ...config,
    scalars: {
      ...config.scalars,
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
        ...config.scalars?.citext,
      },
      uuid: {
        type: 'string',
        ...config.scalars?.citext,
      },
      jsonb: {
        type: 'Record<string, any>',
        ...config.scalars?.JSON,
      },
    },
  };
}
