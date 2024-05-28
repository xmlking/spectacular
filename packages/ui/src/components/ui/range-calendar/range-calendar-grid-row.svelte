<script lang="ts">
import type { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui';
import { cn } from '#utils.js';

type $$Props = RangeCalendarPrimitive.GridRowProps;

let className: $$Props['class'] = undefined;
export { className as class };
</script>

<RangeCalendarPrimitive.GridRow class={cn("flex", className)} {...$$restProps}>
	<slot />
</RangeCalendarPrimitive.GridRow>
