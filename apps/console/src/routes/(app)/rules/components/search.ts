import { searchRulesFn } from '$lib/api/search-rules';
import type { RuleSearch } from '$lib/schema/rule';
import type { GraphQLError } from 'graphql';

interface GQLResult<T> {
  data: T | undefined;
  errors: Partial<GraphQLError>[] | undefined;
}

export interface Rule {
  id: string;
  displayName: string;
  description: string;
}

export async function searchRules(filter: RuleSearch): Promise<GQLResult<Rule[]>> {
  return await searchRulesFn(filter.displayName || '');
}
