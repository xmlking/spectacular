<script>
	export let form;
</script>

<div>
	{#if form?.error}
		<p class="mt-3 text-center font-semibold text-red-500">{form?.error}</p>
	{/if}

	{#if form?.isSuccess}
		<p class="mt-3 text-center font-semibold text-green-500">
			Click the link in the email to finish the sign in process
		</p>
	{/if}

	<form method="POST">
		<input id="email" name="email" type="email" />
		<input id="password" name="password" type="password" />
		<button type="submit" class="variant-filled-primary btn" formaction="?/password"
			>Log in with Password</button
		>
		<button type="submit" class="variant-filled-primary btn" formaction="?/magic_link"
			>Log in with Magic Link</button
		>
		<button type="submit" class="variant-filled-primary btn" formaction="?/google"
			>Log in with Google</button
		>
		<button type="submit" class="variant-filled-secondary btn" formaction="?/github"
			>Log in with GitHub</button
		>

		<button type="submit" class="variant-filled-tertiary btn" formaction="?/azuread"
			>Log in with Azure AD</button
		>
	</form>
</div>
