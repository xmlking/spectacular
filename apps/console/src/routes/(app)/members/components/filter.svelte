<script lang="ts">
import type { DataHandler, Row } from '@vincjo/datatables/legacy';
import { check } from '@vincjo/datatables/legacy';
import { Search } from 'lucide-svelte';

type T = $$Generic<Row>;

export let handler: DataHandler<T>;
let value = '';
let role = '';
let orderBy = '';

handler.on('clearSearch', () => (value = ''));
handler.on('clearFilters', () => (role = ''));
</script>

<!-- Filter Section -->
<div class="mb-6 flex flex-col sm:flex-row gap-4">
  <div class="flex-1 relative">
    <Search size={20} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      bind:value
      placeholder="Search by name or email..."
      spellcheck="false"
      on:input={() => handler.search(value, ['user.displayName', 'user.email'])}
      class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
  <select
    bind:value={role}
    on:change={() => handler.filter(role, 'role', check.isEqualTo)}
    class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
  >
    <option value="all">All Roles</option>
    <option value="member">Member</option>
    <option value="billing">Billing</option>
    <option value="admin">Admin</option>
    <option value="owner">Owner</option>
  </select>
  <select
    bind:value={orderBy}
    on:change={() => handler.sort(orderBy)}
    class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
  >
      <option value="date">Date</option>
      <option value="role">Name(A-Z)</option>
      <option value="user">Name(Z-A)</option>
  </select>
</div>
