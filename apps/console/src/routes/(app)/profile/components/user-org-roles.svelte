<script lang="ts">
import type { GetUser$result } from '$houdini';

export let userOrgRoles: NonNullable<GetUser$result['user']>['userOrgRoles'];
</script>

<div class="card p-4">
<div class="table-container">
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Organization</th>
				<th>Role</th>
				<th>isDefaultRole</th>
			</tr>
		</thead>
		<tbody>
			{#each userOrgRoles as role, i}
				<tr>
					<td>{role.organization}</td>
					<td>{role.role}</td>
					<td>{role.isDefaultRole}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
</div>
