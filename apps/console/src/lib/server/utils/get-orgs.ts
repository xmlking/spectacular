import { Logger } from '@spectacular/utils';
import type { ServerLoadEvent } from '@sveltejs/kit';

import { env as secrets } from '$env/dynamic/private';
import { SearchOrganizationsStore } from '$houdini';
import type { SearchOrganizations$result } from '$houdini';

/**
 * To prevent calling server-side only functions in client-side code, we keep them under `lib/server`
 * IMPORTENT: if new `org` is added to database, call `resetOrgs()`
 */

const log = new Logger('server:utils:orgs');

const searchOrganizationsStore = new SearchOrganizationsStore();
const ADMIN_SECRET = secrets.HASURA_GRAPHQL_ADMIN_SECRET;
const ORGS_QUERY = searchOrganizationsStore.artifact.raw;
const ORGS_HASH = searchOrganizationsStore.artifact.hash;
const cache = new Map();

export async function getOrgs(event: ServerLoadEvent) {
  if (!cache.has(ORGS_HASH)) {
    log.info('cache miss, fetching org data');
    const { errors, data } = await searchOrganizationsStore.fetch({
      event,
      blocking: true,
      metadata: { logResult: true, useRole: 'admin', adminSecret: ADMIN_SECRET },
      variables: {},
    });
    if (errors) {
      return { errors, data: null };
    }
    cache.set(ORGS_HASH, data);
  }
  return { errors: null, data: cache.get(ORGS_HASH) as SearchOrganizations$result };
}

/**
 * reset org cache
 */
export function resetOrgs() {
  cache.clear();
}
