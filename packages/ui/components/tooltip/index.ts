import { Tooltip as TooltipPrimitive } from 'bits-ui';
import Content from './tooltip-content.svelte';

const Root = TooltipPrimitive.Root;
const Trigger = TooltipPrimitive.Trigger;

export const Tooltip = { Root, Content, Trigger };
export { Root as TooltipRoot, Content as TooltipContent, Trigger as TooltipTrigger };
