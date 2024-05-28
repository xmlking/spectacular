<script lang="ts">
import { version } from '$app/environment';
import * as m from '$i18n/messages';
import { languageTag } from '$i18n/runtime';
import { LogoAnim } from '@spectacular/skeleton/components/logos';
console.log(`Client version: ${version}`);
</script>

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<div class="container mx-auto flex h-full items-center justify-center">
	<div class="flex flex-col items-center space-y-10 text-center">
		<h2 class="h2">{m.welcome()}</h2>
		<p>{m.greeting({ name: 'Sumo', count: 5 })}</p>
		<p>{m.current_language_tag({ languageTag: languageTag() })}</p>
		<!-- Animated Logo -->
		<LogoAnim />
		<!-- / -->
		<div class="flex justify-center space-x-2">
			<a class="variant-filled btn" href="/dashboard"> Launch Dashboard </a>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
