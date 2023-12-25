<script lang="ts">
	import { Button } from '$ui/components/button';
	type $$Props = Button.Props;
	type $$Events = Button.Events;
</script>

<Button type="submit" {...$$restProps} on:click on:keydown>
	<slot />
</Button>
