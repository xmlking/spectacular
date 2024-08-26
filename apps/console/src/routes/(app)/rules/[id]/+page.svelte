<script lang="ts">
import { goto } from '$app/navigation';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { updateRuleSchema } from '$lib/schema/rule';
import { getLoadingState } from '$lib/stores/loading';
import { actionOptions, directionOptions, protocols } from '$lib/utils/options';
import { InputChip, RadioGroup, RadioItem, RangeSlider, SlideToggle } from '@skeletonlabs/skeleton';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { GraphQLErrors } from '@spectacular/skeleton/components';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import { Loader } from 'lucide-svelte';
import SuperDebug, { superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageData } from './$types';

const log = new Logger('rules.edit.browser');

export let data: PageData;

const toastStore = getToastStore();
const loadingState = getLoadingState();

const { form, errors, enhance, delayed, submitting } = superForm(data.form, {
  validators: zod(updateRuleSchema),
  onUpdated(event) {
    const { form } = event;
    if (form.valid) {
      handleMessage(
        { type: 'success', message: `Rule updated successfully` },
        toastStore
      );
      goto('/rules');
    }
  },
});

$: loadingState.setFormLoading($delayed);
</script>

<svelte:head>
 <title>Edit Rule</title>
 <meta name="description" content="edit rule" />
</svelte:head>

<div class="page-container">
 <section class="space-y-4">
   <h1 class="h1">Edit Rule</h1>
 </section>

 <section class="space-y-4">
   <Alerts errors={$errors._errors} />

   <form class="card md:space-y-8" method="POST" use:enhance>
     <header class="card-header">
       <div class="text-xl">Edit Rule</div>
     </header>
     <section class="p-4 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
       <div class="col-span-2">
         <Form.Field {form} name="displayName">
           <Form.Label>Display Name</Form.Label>
           <Form.Input />
           <Form.Description>Enter a name for this rule</Form.Description>
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-4">
         <Form.Field {form} name="description">
           <Form.Label>Description</Form.Label>
           <Form.Textarea />
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-3">
         <Form.Field {form} name="tags">
           <Form.Label>Tags</Form.Label>
           <InputChip bind:value={$form.tags} />
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-3">
         <Form.Field {form} name="annotations">
           <Form.Label>Annotations</Form.Label>
           <Form.Input />
           <Form.Description>Format: key1=>value1 (or) "key2" => "value2 with space"</Form.Description>
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-3">
         <Form.Field {form} name="source">
           <Form.Label>Source</Form.Label>
           <Form.Input />
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-3">
         <Form.Field {form} name="sourcePort">
           <Form.Label>Source Port</Form.Label>
           <Form.Input />
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-3">
         <Form.Field {form} name="destination">
           <Form.Label>Destination</Form.Label>
           <Form.Input />
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-3">
         <Form.Field {form} name="destinationPort">
           <Form.Label>Destination Port</Form.Label>
           <Form.Input />
           <Form.Validation />
         </Form.Field>
       </div>
       <div>
         <Form.Field {form} name="protocol">
           <Form.Label>Protocol</Form.Label>
           <Form.Select>
             {#each protocols as protocol}
               <option value={protocol.value}>{protocol.name}</option>
             {/each}
           </Form.Select>
           <Form.Validation />
         </Form.Field>
       </div>
       <div>
         <Form.Field {form} name="action">
           <Form.Label>Action</Form.Label>
           <RadioGroup active="variant-filled-secondary">
             {#each actionOptions as action}
               <RadioItem bind:group={$form.action} value={action.value}>{action.label}</RadioItem>
             {/each}
           </RadioGroup>
           <Form.Validation />
         </Form.Field>
       </div>
       <div>
         <Form.Field {form} name="direction">
           <Form.Label>Direction</Form.Label>
           <RadioGroup active="variant-filled-secondary">
             {#each directionOptions as direction}
               <RadioItem bind:group={$form.direction} value={direction.value}>{direction.label}</RadioItem>
             {/each}
           </RadioGroup>
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-4">
         <Form.Field {form} name="appId">
           <Form.Label>App ID</Form.Label>
           <Form.Input />
           <Form.Description>If no app is selected, throttle rate applied system wide.</Form.Description>
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-2">
         <Form.Field {form} name="throttleRate">
           <Form.Label>Bandwidth Limit</Form.Label>
           <RangeSlider bind:value={$form.throttleRate} min={0} max={100} step={1} ticked />
           <Form.Description>{$form.throttleRate} /100</Form.Description>
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-end-7">
         <Form.Field {form} name="weight">
           <Form.Label>Weight</Form.Label>
           <Form.Input type="number" />
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="flex justify-start">
         <Form.Field {form} name="shared">
           <SlideToggle bind:checked={$form.shared} active="variant-filled-secondary" size="md">
             <span class="inline-block w-[100px] text-left">Shared {$form.shared ? 'On' : 'Off'}</span>
           </SlideToggle>
           <Form.Validation />
         </Form.Field>
       </div>
     </section>
     <footer class="card-footer flex justify-end">
       <button type="submit" class="btn variant-filled-primary" disabled={$submitting}>
         {#if $delayed}
           <Loader class="animate-spin" />
         {:else}
           Update Rule
         {/if}
       </button>
     </footer>
   </form>
 </section>

 <DebugShell label="form-data">
   <SuperDebug data={$form} />
 </DebugShell>
</div>
