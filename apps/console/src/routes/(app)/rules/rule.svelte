<script lang="ts">
import { fragment, graphql } from '$houdini';
import type { RuleCardFields } from '$houdini';

  interface Props {
    rule: RuleCardFields;
  }

  let { rule }: Props = $props();

let data = $derived(fragment(
  rule,
  graphql(`
      fragment RuleCardFields on rules {
        id
        createdAt
        updatedAt
        organization
        tags
      }
    `),
));

let { id, createdAt, updatedAt, organization, tags } = $derived($data);
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
      <p class="font-bold">{organization}</p>
      <p class="font-bold">{tags}</p>
    </div>
  </div>
</div>
