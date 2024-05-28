<script lang="ts">
import type { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui';
import { cn } from '#utils.js';

type $$Props = RangeCalendarPrimitive.HeadingProps;

let className: $$Props['class'] = undefined;
export { className as class };
</script>

<RangeCalendarPrimitive.Heading
	let:headingValue
	class={cn("text-sm font-medium", className)}
	{...$$restProps}
>
	<slot {headingValue}>
		{headingValue}
	</slot>
</RangeCalendarPrimitive.Heading>
