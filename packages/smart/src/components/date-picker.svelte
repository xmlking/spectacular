<script lang="ts">
import { ErrorMessage } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import { JSONParseError, TypeValidationError, generateObject } from 'ai';
import { chromeai } from 'chrome-ai';
import { z } from 'zod';
import { DatePicker } from '@svelte-plugins/datepicker';
import { format } from 'date-fns';
import type { HTMLTextareaAttributes } from 'svelte/elements';
interface $$Props extends HTMLTextareaAttributes {
  startDate?: Date | null;
}
const log = new Logger('experiments:ai:ms:browser');
const api = '/api/date';
let isLoading = false;
let error: string;
let startDate = new Date();
const dateFormat = 'dd-MM-yyyy, hh:mm a';
let isOpen = false;

const toggleDatePicker = () => {
  isOpen = !isOpen;
};
const formatDate = (dateString: Date) => {
  return (dateString && format(new Date(dateString), dateFormat)) || '';
};

let formattedDate = formatDate(startDate);

const onChange = () => {
  try {
    console.log({ formattedDate });
    const parse = Date.parse(formattedDate);
    if (Number.isNaN(parse)) {
      return;
    }
    startDate = new Date(parse);
    // startDate = new Date(formattedDate);
  } catch (err) {
    log.error(err);
    error = `${err}`;
  }
};

$: formattedDate = formatDate(startDate);

// TODO: useObject is not yet supported for svelte https://sdk.vercel.ai/docs/ai-sdk-ui/overview
const useRemoteModel = async (event: SubmitEvent) => {
  try {
    isLoading = true;
    const rawResponse = await fetch(api, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: formattedDate }),
    });
    const content = await rawResponse.json();
    if (content?.date) {
      startDate = content?.date;
      //value =  new Date().toISOString().slice(0,16)
    }
    isLoading = false;
  } catch (err) {
    log.error(err);
    error = `${err}`;
  } finally {
    isLoading = false;
  }
};

const useLocalLocal = async (event: SubmitEvent) => {
  try {
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const input = formData.get('startDate');
    isLoading = true;
    const {
      object: { date },
      rawResponse,
    } = await generateObject({
      model: chromeai('text'),
      system: 'You are a javascript data object generator',
      prompt: `The current date is: ${new Date()} \nGenerate date in format: 'YYYY-MM-DD HH:mm' from text: date of ${input}`,
      schema: z.object({
        // date: z.string().date().transform(value => new Date(value)),
        date: z.coerce.date().describe('local DateTime with timezone'),
      }),
    });
    log.debug({ date });

    if (date) {
      startDate = date;
      //formattedDate = formatDate(date); // date.toISOString().slice(0, 16);
      error = '';
    }
    isLoading = false;
  } catch (err) {
    log.error(err);
    if (TypeValidationError.isInstance(err)) {
      error = `${err.value}`;
    } else if (JSONParseError.isInstance(err)) {
      error = `${err.text}`;
    } else {
      error = `${err}`;
    }
  } finally {
    isLoading = false;
  }
};
</script>

<form
  class="flex flex-col items-center"
  method="POST"
  on:submit|preventDefault={(event) => {
    window.ai?.assistant
      ? useLocalLocal(event)
      : useRemoteModel(event);
  }}
>
  <DatePicker
    bind:isOpen
    bind:startDate
    {...$$props}
    enablePastDates
    enableFutureDates
    showTimePicker
  >
    <input
      name="startDate"
      class="input"
      type="text"
      bind:value={formattedDate}
      on:change={onChange}
      on:click={toggleDatePicker}
    />
  </DatePicker>
  <ErrorMessage {error} />
</form>
