import { env as secrets } from '$env/dynamic/private';
import { ListOrganizationsStore } from '$houdini';
import type { ListOrganizations$result } from '$houdini';
import type { NhostClient } from '@nhost/nhost-js';
import { Logger, asArray } from '@spectacular/utils';
import type { GraphQLError } from 'graphql';
import type { ServerLoadEvent } from '@sveltejs/kit';

/**
 * To prevent calling server-side only functions in client-side code, we keep them under `lib/server`
 * IMPORTENT: if new `org` is added to database, call `resetOrgs()`
 */

const log = new Logger('server:utils:orgs');

const listOrganizationsStore = new ListOrganizationsStore();
const ADMIN_SECRET = secrets.HASURA_GRAPHQL_ADMIN_SECRET;
const ORGS_QUERY = listOrganizationsStore.artifact.raw;
const ORGS_HASH = listOrganizationsStore.artifact.hash;
const cache = new Map();

export async function getOrgsNH(nhost: NhostClient) {
  if (!cache.has(ORGS_HASH)) {
    log.info('cache miss, fetching org data');
    const { data, error } = await nhost.graphql.request(
      ORGS_QUERY,
      {},
      {
        headers: {
          'X-Hasura-Admin-Secret': ADMIN_SECRET,
        },
      },
    );
    if (error) {
      return { errors: asArray<GraphQLError>(error), data: null };
    }
    cache.set(ORGS_HASH, data);
  }
  return { errors: null, data: cache.get(ORGS_HASH) as ListOrganizations$result };
}

export async function getOrgs(event: ServerLoadEvent) {
  if (!cache.has(ORGS_HASH)) {
    log.info('cache miss, fetching org data');
    const { errors, data } = await listOrganizationsStore.fetch( {
      event,
      blocking: true,
      metadata: { logResult: true, useRole: 'admin',  adminSecret: ADMIN_SECRET },
      variables: {}
    });
    if (errors) {
      return { errors, data: null };
    }
    cache.set(ORGS_HASH, data);
  }
  return { errors: null, data: cache.get(ORGS_HASH) as ListOrganizations$result };
}

/**
 * reset org cache
 */
export function resetOrgs() {
  cache.clear();
}
