<script lang="ts">
import type { GetUser$result } from '$houdini';

export let userProviders: NonNullable<GetUser$result['user']>['userProviders'];

export let message: App.Superforms.Message | undefined;
export let errors: string[];
</script>

<div class="card p-4">
  <pre>{JSON.stringify(userProviders, null, 2)}</pre>
</div>

