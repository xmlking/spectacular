<script lang="ts">
import type { GetUser$result } from '$houdini';

export let personalAccessTokens: NonNullable<GetUser$result['user']>['personalAccessTokens'];
export let message: App.Superforms.Message | undefined;
export let errors: string[];
</script>

<div class="card p-4">
  <pre>{JSON.stringify(personalAccessTokens, null, 2)}</pre>
</div>
