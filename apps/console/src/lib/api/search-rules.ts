// $lib/api/search-rules.ts
import { CachePolicy, type SearchRules$result, graphql, order_by } from '$houdini';
import type { Rule, RuleSearch } from '$lib/schema/rule';
import { Logger } from '@spectacular/utils';
import type { GraphQLError } from 'graphql';

interface GQLResult<T> {
  data: T | undefined;
  errors: Partial<GraphQLError>[] | null;
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
      source
      sourcePort
      destination
      destinationPort
      protocol
      action
      direction
      appId
      throttleRate
      weight
      shared
      updatedAt
    }
  }
`);

export async function searchRulesFn(filter: RuleSearch): Promise<GQLResult<Rule[]>> {
  if (filter.displayName && filter.displayName.length < 4) return { data: [], errors: null };

  const where = filter.displayName ? { displayName: { _ilike: `%${filter.displayName}%` } } : undefined;

  const variables = {
    where,
    limit: filter.limit,
    offset: filter.offset,
    orderBy: [{ updatedAt: order_by.desc_nulls_last }],
  };

  const { data, errors } = await searchRules.fetch({
    blocking: true,
    policy: CachePolicy.CacheAndNetwork,
    metadata: { logResult: true },
    variables,
  });

  return { data: data?.rules as Rule[], errors };
}
