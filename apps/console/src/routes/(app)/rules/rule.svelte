<script lang="ts">
import { fragment, graphql } from '$houdini';
import type { RuleCardFields } from '$houdini';

export let rule: RuleCardFields;

$: data = fragment(
  rule,
  graphql(`
      fragment RuleCardFields on rules {
        id
        createdAt
        updatedAt
        orgId
        tags
      }
    `),
);

$: ({ id, createdAt, updatedAt, orgId, tags } = $data);
</script>

<div
  class="py-2.5 duration-200"
  role="listitem"
>
  <div class="relative">
    <div class="flex items-center">
      <p class="font-bold">{id}</p>
      <p class="font-bold">{createdAt}</p>
      <p class="font-bold">{updatedAt}</p>
      <p class="font-bold">{orgId}</p>
      <p class="font-bold">{tags}</p>
    </div>
  </div>
</div>
