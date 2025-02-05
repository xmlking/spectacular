<!--
@component ComboBox - allow users to use natural language to filter given list of items using On-Device AI
  @prop {string} value - 	Selected value(s)
  @prop {string[]} items - Array of items available to display / filter
  @prop {number} debounceWait - milliseconds debounce wait
  @prop {string} name - Name attribute of hidden input, helpful for form actions
  @slot prepend - prepend
  @slot clear-icon - clear-icon

  Usage:
  ```svelte
    <ComboBox
      items={['item1', 'item2'...]}
      debounceWait={300}
      bind:value={$formData.specialization}
      {...$constraints.specialization}
    />
  ```
-->
<script lang="ts">
import { ErrorMessage } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import Select from 'svelte-select';
import type { HTMLSelectAttributes } from 'svelte/elements';
import { writable } from 'svelte/store';
interface $$Props extends HTMLSelectAttributes {
  value: string;
  items: Readonly<string[]>;
  debounceWait?: number;
  name?: string | null;
  api?: Readonly<string>;
}

// Props
export let value = '';
export let items: Readonly<string[]>;
export let debounceWait = 300;
export let name: string | null = null;
export let api = '/api/combobox';

// Variables
const log = new Logger('smart:textarea:browser');
let loading = false;
let error: string;
// const options = writable([]);
let filterText = '';

// Functions
async function handleOptions(filterText: string) {
  if (filterText.length === 0) return [...items];
  if (self.aibrow) {
    return useLocalModel(filterText);
  }
  let res = await useRemoteModel(filterText);
  log.debug({ res });
  return res;
}

// Define the type of object we want returned
const grammar = {
  title: 'provider specialization',
  type: 'object',
  properties: {
    specializations: {
      type: 'array',
      items: {
        type: 'string',
        enum: items,
      },
    },
  },
};

const useLocalModel = async (filterText: string) => {
  let session;
  try {
    loading = true;
    session = await self.aibrow.coreModel.create({ grammar });
    const prompt = `Extract data from the following text: ${filterText}`;
    const output = await session.prompt(prompt);
    log.debug({ output });
    return JSON.parse(output).specializations;
  } catch (err) {
    console.error(err);
    error = `${err}`;
  } finally {
    session?.destroy();
    loading = false;
  }
};

// TODO: useObject is not yet supported for svelte https://sdk.vercel.ai/docs/ai-sdk-ui/overview
const useRemoteModel = async (filterText: string) => {
  try {
    loading = true;
    const rawResponse = await fetch(api, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filterText }),
    });
    const content = await rawResponse.json();
    if (content[0]?.options) {
      // console.log({ result: content[0]?.options });
      return content[0]?.options;
    }
    loading = false;
  } catch (err) {
    console.log(err);
    error = `${err}`;
  } finally {
    loading = false;
  }
};
</script>

<Select
  bind:filterText
  bind:justValue={value}
  bind:loading
  {name}
  {debounceWait}
  loadOptions={handleOptions}
  placeholder="start typing..."
  --tw-border-opacity="1"
  --tw-bg-opacity="1"
  --background="rgb(var(--color-surface-200))"
  --border-radius="var(--theme-rounded-base)"
  --border="var(--theme-border-base) solid rgb(var(--color-surface-400))"
  --border-hover="var(--theme-border-base) solid rgb(var(--color-surface-500))"
  --border-focused="var(--theme-border-base) solid rgb(var(--color-primary-500) / var(--tw-border-opacity))"
  --error-background="rgb(var(--color-error-200) / var(--tw-bg-opacity))"
  --error-border="rgb(var(--color-error-500) / var(--tw-bg-opacity))"
  --disabled-color="rgb(var(--color-surface-400) / 2)"
  --disabled-border-color="rgb(var(--color-surface-400) / 2)"
  --disabled-background="rgb(var(--color-surface-200) / 2)"
  --list-background="rgb(var(--color-surface-200) / var(--tw-bg-opacity))"
  --list-border="var(--theme-border-base) solid rgb(var(--color-surface-400) / var(--tw-bg-opacity))"
  --list-border-radius="var(--theme-rounded-container)"
  --list-empty-padding="10px"
  --list-z-index="100"
  --item-color="var(--body-text-color)"
  --item-border="var(--comfy-dropdown-border-color)"
  --item-is-active-color="rgba(var(--theme-font-color-dark))"
  --item-hover-color="rgba(var(--on-secondary))"
  --item-active-background="rgb(var(--color-surface-400) /2)"
  --item-is-active-bg="var(--pd-input-field-hover-stroke)"
  --item-hover-bg="rgba(var(--color-secondary-500) / 1)"
  {...$$restProps}
/>

<ErrorMessage {error} />
