<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { X } from 'lucide-svelte';

const dispatch = createEventDispatcher();

// Form data
let name = '';
let email = '';
let role: 'admin' | 'owner' | 'member' = 'member';

// Validation state
let errors: Record<string, string> = {};

/** Validate form */
const validateForm = () => {
  const newErrors: Record<string, string> = {};

  if (!name.trim()) newErrors.name = 'Name is required';
  if (!email.trim()) newErrors.email = 'Email is required';
  if (!email.includes('@')) newErrors.email = 'Invalid email address';

  errors = newErrors;
  return Object.keys(newErrors).length === 0;
};

/** Handle form submission */
const handleSubmit = (e: SubmitEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  const memberData = {
    name,
    email,
    role,
    avatar: 'assets/avatars/03.png',
  };

  dispatch('submit', memberData);
};
</script>

<form on:submit={handleSubmit} class="p-4">
	<div class="space-y-4">
		<div>
			<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
			<input id="name" type="text" bind:value={name} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter member name" />
			{#if errors.name}
				<p class="mt-1 text-sm text-red-600">{errors.name}</p>
			{/if}
		</div>

		<div>
			<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
			<input id="email" type="email" bind:value={email} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter member email" />
			{#if errors.email}
				<p class="mt-1 text-sm text-red-600">{errors.email}</p>
			{/if}
		</div>

		<div>
			<label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
			<select id="role" bind:value={role} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
				<option value="member">Member</option>
				<option value="admin">Admin</option>
				<option value="owner">Owner</option>
			</select>
		</div>
	</div>

	<div class="mt-6 flex justify-end gap-3">
		<button type="button" on:click={() => dispatch("cancel")} class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
		<button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Add Member</button>
	</div>
</form>
