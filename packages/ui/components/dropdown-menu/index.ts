import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
import Item from './dropdown-menu-item.svelte';
import Label from './dropdown-menu-label.svelte';
import Content from './dropdown-menu-content.svelte';
import Shortcut from './dropdown-menu-shortcut.svelte';
import RadioItem from './dropdown-menu-radio-item.svelte';
import Separator from './dropdown-menu-separator.svelte';
import RadioGroup from './dropdown-menu-radio-group.svelte';
import SubContent from './dropdown-menu-sub-content.svelte';
import SubTrigger from './dropdown-menu-sub-trigger.svelte';
import CheckboxItem from './dropdown-menu-checkbox-item.svelte';

const Sub = DropdownMenuPrimitive.Sub;
const Root = DropdownMenuPrimitive.Root;
const Trigger = DropdownMenuPrimitive.Trigger;
const Group = DropdownMenuPrimitive.Group;

export const DropdownMenu = {
	Root,
	Sub,
	Item,
	Label,
	Content,
	Trigger,
	Shortcut,
	RadioItem,
	Separator,
	RadioGroup,
	SubContent,
	SubTrigger,
	CheckboxItem
};
export {
	Root as DropdownMenuRoot,
	Sub as DropdownMenuSub,
	Item as DropdownMenuItem,
	Label as DropdownMenuLabel,
	Group as DropdownMenuGroup,
	Content as DropdownMenuContent,
	Trigger as DropdownMenuTrigger,
	Shortcut as DropdownMenuShortcut,
	RadioItem as DropdownMenuRadioItem,
	Separator as DropdownMenuSeparator,
	RadioGroup as DropdownMenuRadioGroup,
	SubContent as DropdownMenuSubContent,
	SubTrigger as DropdownMenuSubTrigger,
	CheckboxItem as DropdownMenuCheckboxItem
};
