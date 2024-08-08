import type { PolicySearch, PolicySearchSchema } from '$lib/schema/policy';
import type { GraphQLError } from 'graphql';

interface GQLResult<T> {
  data: T | undefined;
  errors: Partial<GraphQLError>[] | undefined;
}

export interface Subject {
  id: string;
  displayName: string;
  secondaryId: string;
}

// TODO: throttle-debounce , prevent double calling, finish
export function searchSubjects(filter: PolicySearch): GQLResult<Subject[]> {
  console.log(filter.subjectDisplayName?.length);
  return {
    data: [
      {
        id: '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3',
        displayName: 'sumo demo',
        secondaryId: 'sumo@demo.com',
      },
      {
        id: '7f3b9e08-65e2-4ae4-a7df-0d7ff9a34378',
        displayName: 'manager at chinthagunta',
        secondaryId: 'manager@chinthagunta.com',
      },
      {
        id: '8c7bb3ac-e469-4a07-8d30-e607a278abdc',
        displayName: 'user1 at chinthagunta',
        secondaryId: 'user1@chinthagunta.com',
      },
      {
        id: 'f5c7d469-c5a1-412d-9551-2263091c12ff',
        displayName: 'user2 at chinthagunta',
        secondaryId: 'user2@chinthagunta.com',
      },
    ],
    errors: undefined,
    // [
    //   {
    //     extensions: {
    //       path: '$.variableValues',
    //       code: 'validation-failed',
    //     },
    //     message: 'unexpected variables in variableValues: products',
    //   },
    // ],
  };
}
