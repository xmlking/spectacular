<script lang="ts">
import type { DataHandler, Field, Comparator, Row } from '@vincjo/datatables/legacy';
import { check } from '@vincjo/datatables/legacy';
import { Search, SearchIcon } from 'lucide-svelte';

type T = $$Generic<Row>;

export let handler: DataHandler<T>;
export let searchFields: Field<T>[] = ['displayName', 'email'];
export let orderBy: Field<T> = 'updatedAt';
export let filterBy: Field<T> = 'role';
export let comparator: Comparator<T> = check.isEqualTo;

let value = '';
let role = '';

handler.on('clearSearch', () => (value = ''));
handler.on('clearFilters', () => (role = ''));
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
    on:input={() => handler.search(value, searchFields)}
  />
  <select
    bind:value={role}
    on:change={() => handler.filter(role, filterBy, comparator)}
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
    on:change={() => handler.sort(orderBy)}
  >
    <option value="updatedAt">Date</option>
    <option value="displayName">Name(A-Z)</option>
    <option value="role">Name(Z-A)</option>
  </select>
</div>
