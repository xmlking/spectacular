import { CachePolicy, graphql, order_by, subject_type_enum, type subject_type_enum$options } from '$houdini';
import type { PolicySearch, PolicySearchSchema } from '$lib/schema/policy';
import { Logger } from '@spectacular/utils';
import type { GraphQLError } from 'graphql';

interface GQLResult<T> {
  data: T | undefined;
  errors: Partial<GraphQLError>[] | null;
}

export interface Subject {
  id: string;
  displayName: string;
  secondaryId?: string;
}

const log = new Logger('api:subjects:search');

const searchUsers = graphql(`
        query SearchUsers(
            $where: users_bool_exp
            $limit: Int = 50
            $offset: Int = 0
            $orderBy: [users_order_by!] = [{ updatedAt: desc_nulls_last }]
          ) {
            users(order_by: $orderBy, limit: $limit, offset: $offset, where: $where) {
                id
                displayName
            }
        }
    `);

const searchGroups = graphql(`
        query SearchGroups(
            $where: groups_bool_exp
            $limit: Int = 50
            $offset: Int = 0
            $orderBy: [groups_order_by!] = [{ updatedAt: desc_nulls_last }]
          ) {
            groups(order_by: $orderBy, limit: $limit, offset: $offset, where: $where) {
                id
                displayName
            }
        }
    `);

const searchDevices = graphql(`
        query SearchDevices(
            $where: devices_bool_exp
            $limit: Int = 50
            $offset: Int = 0
            $orderBy: [devices_order_by!] = [{ updatedAt: desc_nulls_last }]
          ) {
            devices(order_by: $orderBy, limit: $limit, offset: $offset, where: $where) {
                id
                displayName
            }
        }
    `);

const searchPools = graphql(`
        query SearchPools(
            $where: pools_bool_exp
            $limit: Int = 50
            $offset: Int = 0
            $orderBy: [pools_order_by!] = [{ updatedAt: desc_nulls_last }]
          ) {
            pools(order_by: $orderBy, limit: $limit, offset: $offset, where: $where) {
                id
                displayName
            }
        }
    `);

const limit = 10;
const orderBy = [{ updatedAt: order_by.desc_nulls_last }];

// TODO: throttle-debounce , prevent double calling, finish
export async function searchSubjects(
  subjectType: subject_type_enum$options,
  subjectNameTerm: string,
): Promise<GQLResult<Subject[]>> {
  if (subjectNameTerm.length < 4) return { data: [], errors: null };

  const where = {
    displayName: { _ilike: `%${subjectNameTerm}%` },
  };

  const variables = { where, limit, orderBy };

  switch (subjectType) {
    case subject_type_enum.user:
    case subject_type_enum.service_account: {
      const { data, errors } = await searchUsers.fetch({
        blocking: true,
        policy: CachePolicy.CacheAndNetwork,
        metadata: { logResult: true },
        variables,
      });
      return { data: data?.users, errors };
    }
    case subject_type_enum.group: {
      const { data, errors } = await searchGroups.fetch({
        blocking: true,
        policy: CachePolicy.CacheAndNetwork,
        metadata: { logResult: true },
        variables,
      });
      return { data: data?.groups, errors };
    }
    case subject_type_enum.device: {
      const { data, errors } = await searchDevices.fetch({
        blocking: true,
        policy: CachePolicy.CacheAndNetwork,
        metadata: { logResult: true },
        variables,
      });
      return { data: data?.devices, errors };
    }
    case subject_type_enum.device_pool: {
      const { data, errors } = await searchPools.fetch({
        blocking: true,
        policy: CachePolicy.CacheAndNetwork,
        metadata: { logResult: true },
        variables,
      });
      return { data: data?.pools, errors };
    }
    default:
      throw new Error(`Unknown Subject Type: ${subjectType}`, { cause: Error(`${subjectType}`) });
  }
}
