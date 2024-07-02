<script lang="ts">
import { Icon } from '@spectacular/skeleton/components/icons';
  import { Github } from 'lucide-svelte';
</script>

<!-- Signin with social -->
<form method="POST">
  <div class="flex flex-row justify-evenly">
    <button type="submit" formaction="/signin?/google" class="variant-filled-warning btn-icon"
      ><Icon name="google" /></button
    >
    <button type="submit" formaction="/signin?/github" class="variant-filled-secondary btn-icon"><Github /></button>
    <button type="submit" formaction="/signin?/azuread" class="variant-filled-error btn-icon"
      ><Icon name="microsoft" /></button
    >
  </div>
</form>






<!--
<div class="flex flex-col md:flex-row justify-evenly space-x-1 space-y-4">
	<button type="button" class="btn variant-filled-warning">
		<span><Icon name="google" /></span>
		<span>Google</span>
	</button>
	<button type="button" class="btn variant-filled-success">
		<span><Github /></span>
		<span>GitHub</span>
	</button>
	<button type="button" class="btn variant-filled-error">
		<span><Icon name="microsoft" /></span>
		<span>AzureAD</span>
	</button>
		<button type="button" class="btn variant-filled-error">
		<span><Icon name="microsoft" /></span>
		<span>PingID</span>
	</button>
</div>
-->
