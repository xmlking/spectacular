<script lang="ts">
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import LL from '$lib/i18n/i18n-svelte';

	export let data;
</script>

<form method="POST" action="/auth/sign-in">
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">{$LL.auth.forms.email.label()}</span>
			<input
				id="email"
				name="email"
				type="email"
				placeholder={$LL.auth.forms.email.placeholder()}
				autocomplete="email"
				class="input"
			/>
		</label>
	</div>

	<div class="mt-6">
		<label class="label">
			<span class="sr-only">{$LL.auth.forms.password.label()}</span>
			<input
				id="password"
				name="password"
				type="password"
				placeholder={$LL.auth.forms.password.placeholder()}
				class="input"
			/>
		</label>
	</div>
	<div class="mt-6">
		<button type="submit" class="variant-filled-primary btn w-full"
			>{$LL.auth.labels.signin()}</button
		>
	</div>
	<div class="mt-10 flex flex-row items-center justify-center">
		<a href="/auth/password/reset" class="font-semibold">{$LL.auth.labels.forgotPassword()}</a>
	</div>
</form>

<SuperDebug {data} />
