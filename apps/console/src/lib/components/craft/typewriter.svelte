<script lang="ts">
import { typewriter } from '$lib/ui/transitions';

let visible = false;
</script>

<div class="relative flex min-h-dvh w-full flex-col items-center justify-cente text-black">
<label>
	<input type="checkbox" bind:checked={visible} />
	visible
</label>

{#if visible}
	<p class="font-mono w-96" transition:typewriter>
		All work and no play makes Jack a dull boy All work and no play makes Jack a dull boy All work
		and no play mmakes Jack a dull boy All work and no PLay ma es Jack a dull boy All work and no
		play makes Jack a dull boy
	</p>
{/if}
</div>

