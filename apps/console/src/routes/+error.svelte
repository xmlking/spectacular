<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-js-adapter-sveltekit';
	import LogoAnim from '@spectacular/skeleton/components/logos/LogoAnim.svelte';
	import { page } from '$app/stores';
	import { i18n } from '$lib/i18n';
	import * as m from '$i18n/messages';
</script>

<ParaglideJS {i18n}>
	{#if $page}
		<div class="flex h-full w-full items-center justify-center">
			<div class="space-y-4 text-center">
				<LogoAnim />
				<h2 class="h2">
					{$page.status}:{#if $page.error}
						{$page.error.message}
					{/if}
				</h2>
				<p>{m.error_page_message()}</p>
				<a href="/blog" title="Go to Homepage">
					<h2 class="hidden font-serif text-2xl md:block">Datablocks</h2>
				</a>
			</div>
		</div>
	{/if}
</ParaglideJS>
