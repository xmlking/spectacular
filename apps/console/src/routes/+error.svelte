<script lang="ts">
import { ParaglideJS } from '@inlang/paraglide-js-adapter-sveltekit';
import { LogoAnim } from '@spectacular/skeleton/components/logos';
import { page } from '$app/stores';
import { i18n } from '$lib/i18n';
import * as m from '$i18n/messages';

const details = $page.error?.details;
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
				{#if details}
					<div class="text-sm">
						{#if typeof details == 'string'}
							<div>{details}</div>
						{:else}
							{#each Object.entries(details) as [key, value]}
								<div>{key}:{value}</div>
							{/each}
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</ParaglideJS>
