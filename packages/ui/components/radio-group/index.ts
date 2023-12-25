import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';

import Root from './radio-group.svelte';
import Item from './radio-group-item.svelte';

const Input = RadioGroupPrimitive.Input;

export const RadioGroup = { Root, Input, Item };
export { Root as RadioGroupRoot, Input as RadioGroupInput, Item as RadioGroupItem };
