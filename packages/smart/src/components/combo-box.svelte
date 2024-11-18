<script lang="ts">
import { ErrorMessage } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import Select from 'svelte-select';
import { writable } from 'svelte/store';
import type { HTMLTextareaAttributes } from 'svelte/elements';
interface $$Props extends HTMLTextareaAttributes {
  selected?: any;
}
const log = new Logger('experiments:ai:ms:browser');
const api = '/api/combobox';
let isLoading = false;
let error: string;
const options = writable([]);

let value = '';
export let selected = '';
// TODO: useObject is not yet supported for svelte https://sdk.vercel.ai/docs/ai-sdk-ui/overview
const useRemoteModel = async (event: Event) => {
  try {
    isLoading = true;
    const rawResponse = await fetch(api, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    });
    const content = await rawResponse.json();
    if (content[0]?.options) {
      // console.log({ result: content[0]?.options });
      return content[0]?.options;
    }
    isLoading = false;
  } catch (err) {
    console.log(err);
    error = `${err}`;
  } finally {
    isLoading = false;
  }
};
</script>

<form class="flex flex-col items-center">
  <Select
    bind:filterText={value}
    bind:justValue={selected}
    loadOptions={useRemoteModel}
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
  />

  <ErrorMessage {error} />
</form>
