<script lang="ts">
import type { Comparator, DataHandler, Field, Row } from '@vincjo/datatables/legacy';
import { check } from '@vincjo/datatables/legacy';
import { Search, SearchIcon } from 'lucide-svelte';

type T = $$Generic<Row>;

  interface Props {
    handler: DataHandler<T>;
    searchFields?: Field<T>[];
    orderBy?: Field<T>;
    filterBy?: Field<T>;
    comparator?: Comparator<T>;
  }

  let {
    handler,
    searchFields = ['displayName', 'email'],
    orderBy = $bindable('updatedAt'),
    filterBy = 'role',
    comparator = check.isEqualTo
  }: Props = $props();

let value = $state('');
let role = $state('');

handler.on('clearSearch', () => {
  value = '';
});
handler.on('clearFilters', () => {
  role = '';
});
</script>

<!-- Filter Section -->
<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
  <div class="input-group-shim"><SearchIcon size={17} /></div>
  <input
    type="search"
    placeholder="Search by name or email..."
    autocomplete="off"
    spellcheck="false"
    autocorrect="off"
    bind:value
    oninput={() => handler.search(value, searchFields)}
  />
  <select
    bind:value={role}
    onchange={() => handler.filter(role, filterBy, comparator)}
  >
    <option value="">All Roles</option>
    <option value="org:member">Member</option>
    <option value="org:billing">Billing</option>
    <option value="org:admin">Admin</option>
    <option value="org:owner">Owner</option>
  </select>
</div>
<div>
  <select
    class="select"
    bind:value={orderBy}
    onchange={() => handler.sort(orderBy)}
  >
    <option value="updatedAt">Date</option>
    <option value="displayName">Name(A-Z)</option>
    <option value="role">Name(Z-A)</option>
  </select>
</div>
