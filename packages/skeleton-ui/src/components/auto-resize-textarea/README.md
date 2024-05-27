# Auto-resize Textarea for Svelte

An in-built auto-resize functionality for a textarea element using the scroll height of a singleton proxy textarea element attached to the document body. This is the 100% accurate implementation and does not break irrespective of the borders, padding, or amount of text.

## Install

`npm install svelte-autoresize-textarea`

## Usage

```svelte
<script>
	import { AutoResizeTextarea } from 'svelte-autoresize-textarea';
</script>

<template>
	<AutoResizeTextarea :maxRows="10" :minRows="4" />
</template>
```

## Props

| prop      | type     | description                                              |
| --------- | -------- | -------------------------------------------------------- |
| `maxRows` | `number` | Maximum number of rows up to which the textarea can grow |
| `minRows` | `number` | Minimum number of rows to show for textarea              |

Apart from these, the component accepts all props that are accepted by `<textarea/>`.
