import { CachePolicy, type SearchRulesAPI$result, graphql, order_by } from '$houdini';
import type { PartialGraphQLErrors, Subject } from '$lib/types';
import { Logger } from '@spectacular/utils';
import { type Result, err, ok } from 'neverthrow';

/**
 * HINT: Using `neverthrow` lib's `Result` to annotate a functions
 * https://x.com/mattpocockuk/status/1825552717571629306
 */

const log = new Logger('api:rules:search');

const searchRules = graphql(`
        query SearchRulesAPI(
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
            metadata
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
export async function searchRulesFn(
  displayNameTerm: string,
): Promise<Result<SearchRulesAPI$result['rules'], PartialGraphQLErrors>> {
  if (displayNameTerm.length < 4) return ok([]);

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
  return data?.rules ? ok(data.rules) : err(errors);
}
