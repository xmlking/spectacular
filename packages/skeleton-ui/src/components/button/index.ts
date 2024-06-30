import { type VariantProps, tv } from "tailwind-variants";
import type { Button as ButtonPrimitive } from "bits-ui";
import Root from "./button.svelte";

const buttonVariants = tv({
  base: 'btn',
  variants: {
    variant: {
      filled: 'variant-filled',
      ghost: 'variant-ghost',
      soft: 'variant-soft',
      ringed: 'variant-ringed',
    },
    color: {
      surface: 'surface',
      primary: 'primary',
      secondary: 'secondary',
      tertiary: 'tertiary',
      success: 'success',
      warning: 'warning',
      error: 'error',
    },
    size: {
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
      xl: 'btn-xl',
    },
  },
  compoundVariants: [
    {
      variant: 'filled',
      color: 'surface',
      class: 'variant-filled-surface',
    },
    {
      variant: 'filled',
      color: 'primary',
      class: 'variant-filled-primary',
    },
    {
      variant: 'filled',
      color: 'secondary',
      class: 'variant-filled-secondary',
    },
    {
      variant: 'filled',
      color: 'tertiary',
      class: 'variant-filled-tertiary',
    },
    {
      variant: 'filled',
      color: 'success',
      class: 'variant-filled-success',
    },
    {
      variant: 'filled',
      color: 'warning',
      class: 'variant-filled-warning',
    },
    {
      variant: 'filled',
      color: 'error',
      class: 'variant-filled-error',
    },
  ],
  defaultVariants: {
    variant: 'filled',
    color: 'primary',
    size: 'md',
  },
});

type Variant = VariantProps<typeof buttonVariants>["variant"];
type Color = VariantProps<typeof buttonVariants>['color'];
type Size = VariantProps<typeof buttonVariants>["size"];

type Props = ButtonPrimitive.Props & {
	variant?: Variant;
  color?: Color;
	size?: Size;
};

type Events = ButtonPrimitive.Events;

export {
	Root,
	type Props,
	type Events,
	//
	Root as Button,
	type Props as ButtonProps,
	type Events as ButtonEvents,
	buttonVariants,
};
