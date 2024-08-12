import { CachePolicy, graphql, order_by, type SearchRules$result } from '$houdini';
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

const log = new Logger('api:rules:search');

const searchRules = graphql(`
        query SearchRules(
          $where: rules_bool_exp
          $limit: Int = 50
          $offset: Int = 0
          $orderBy: [rules_order_by!] = [{ updatedAt: desc_nulls_last }]
        ) @cache(policy: NetworkOnly) {
          rules(order_by: $orderBy, limit: $limit, offset: $offset, where: $where) {
            id
            displayName
            description
            tags
            annotations
            shared
            source
            sourcePort
            destination
            destinationPort
            protocol
            direction
            action
            appId
            throttleRate
            weight
            updatedBy
            updatedAt
          }
        }
    `);

const limit = 10;
const orderBy = [{ updatedAt: order_by.desc_nulls_last }];

// TODO: throttle-debounce , prevent double calling, finish
export async function searchRulesFn(displayNameTerm: string) {
  if (displayNameTerm.length < 4) return { data: [], errors: null };

  const where = {
    displayName: { _ilike: `%${displayNameTerm}%` },
  };

  const variables = { where, limit, orderBy };

  const { data, errors } = await searchRules.fetch({
    blocking: true,
    policy: CachePolicy.CacheAndNetwork,
    metadata: { logResult: true },
    variables,
  });
  return { data: data?.rules, errors };
}
