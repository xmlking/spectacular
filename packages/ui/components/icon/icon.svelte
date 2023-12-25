<script lang="ts">
	import 'iconify-icon';
	import { cn } from '$ui/utils';
	import type { IconifyIconProperties } from 'iconify-icon';

	type $$Props = IconifyIconProperties & { class?: string | null };

	let className: $$Props['class'] = undefined;
	export let icon: $$Props['icon'];
	export { className as class };
</script>

<iconify-icon {icon} class={cn('text-base', className)}></iconify-icon>
