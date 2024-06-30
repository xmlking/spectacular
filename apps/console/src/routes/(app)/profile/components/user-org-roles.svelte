<script lang="ts">
import type { GetUser$result } from '$houdini';

export let userOrgRoles: NonNullable<GetUser$result['user']>['userOrgRoles'];
</script>

<div class="card p-4">
  <pre>{JSON.stringify(userOrgRoles, null, 2)}</pre>
</div>
