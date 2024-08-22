/// <reference path="../.astro/env.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly SITE_URL: string;
	readonly PUBLIC_NHOST_GRAPHQL_URL: string;
	// more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
