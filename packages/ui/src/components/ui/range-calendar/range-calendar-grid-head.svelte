<script lang="ts">
import type { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui';
import { cn } from '#utils.js';

type $$Props = RangeCalendarPrimitive.GridHeadProps;

let className: $$Props['class'] = undefined;
export { className as class };
</script>

<RangeCalendarPrimitive.GridHead class={cn(className)} {...$$restProps}>
	<slot />
</RangeCalendarPrimitive.GridHead>
