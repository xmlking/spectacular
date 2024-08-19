<script lang="ts">
import { goto } from '$app/navigation';
import { graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n.js';
import { createRuleSchema as schema } from '$lib/schema/rule';
import { createRuleKeys as keys } from '$lib/schema/rule';
import { getLoadingState } from '$lib/stores/loading';
import { actionOptions, directionOptions, protocols } from '$lib/utils/options';
import { InputChip, RadioGroup, RadioItem, RangeSlider, SlideToggle } from '@skeletonlabs/skeleton';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger, cleanClone } from '@spectacular/utils';
import * as Form from 'formsnap';
import type { GraphQLError } from 'graphql';
import { Loader, MoreHorizontal } from 'lucide-svelte';
import SuperDebug, { superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const log = new Logger('rules.create.browser');

export let data;

const toastStore = getToastStore();
const loadingState = getLoadingState();
let gqlErrors: Partial<GraphQLError>[] | null;

const createRule = graphql(`
   mutation CreateRule($data: rules_insert_input!) {
     insert_rules_one(object: $data) {
       id
       displayName
       description
       tags
       annotations
       source
       sourcePort
       destination
       destinationPort
       protocol
       action
       direction
       appId
       throttleRate
       weight
       shared
       createdAt
       updatedAt
     }
   }
 `);

const superform = superForm(data.form, {
 dataType: 'json',
 taintedMessage: null,
 syncFlashMessage: false,
 resetForm: true,
 validators: zod(schema),
 onUpdated({ form }) {
   if (form.valid) {
     log.debug('before cleanClone with strip:', form.data);
     const dataCopy = cleanClone(form.data, { empty: 'strip' });
     log.debug('after cleanClone with strip:', dataCopy);

     createRule.mutate(
       { data: dataCopy },
       {
         onResult: ({ data, errors }) => {
           if (errors) {
             gqlErrors = errors;
             log.error('create rule api call error:', errors);
             return;
           }

           const result = data?.insert_rules_one;
           if (!result) {
             handleMessage(
               { type: 'error', message: 'Create rule failed: response empty' },
               toastStore
             );
             return;
           }

           handleMessage(
             { type: 'success', message: `Rule created: ${result.displayName}` },
             toastStore
           );
           goto(i18n.resolveRoute('/rules'), { invalidateAll: false });
         },
       }
     );
   }
 },
 onError({ result }) {
   log.error('superForm onError:', { result });
 },
});

const { form, errors, enhance, delayed, submitting } = superform;

$: loadingState.setFormLoading($delayed);
</script>

<svelte:head>
 <title>Create Rule</title>
 <meta name="description" content="create rule" />
</svelte:head>

<div class="page-container">
 <section class="space-y-4">
   <h1 class="h1">Create Rule</h1>
 </section>

 <section class="space-y-4">
   <Alerts errors={$errors._errors} />
   <GraphQLErrors errors={gqlErrors} />

   <form class="card md:space-y-8" method="POST" use:enhance>
     <header class="card-header">
       <div class="text-xl">Create Rule</div>
     </header>
     <section class="p-4 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
       <div class="col-span-2">
         <Form.Field {form} name={keys.displayName}>
           <Form.Label>Display Name</Form.Label>
           <Form.Input />
           <Form.Description>Enter a name for this rule</Form.Description>
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-4">
         <Form.Field {form} name={keys.description}>
           <Form.Label>Description</Form.Label>
           <Form.Textarea />
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-3">
         <Form.Field {form} name={keys.tags}>
           <Form.Label>Tags</Form.Label>
           <InputChip bind:value={$form.tags} />
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-3">
         <Form.Field {form} name={keys.annotations}>
           <Form.Label>Annotations</Form.Label>
           <Form.Input />
           <Form.Description>Format: key1=>value1 (or) "key2" => "value2 with space"</Form.Description>
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-3">
         <Form.Field {form} name={keys.source}>
           <Form.Label>Source</Form.Label>
           <Form.Input />
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-3">
         <Form.Field {form} name={keys.sourcePort}>
           <Form.Label>Source Port</Form.Label>
           <Form.Input />
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-3">
         <Form.Field {form} name={keys.destination}>
           <Form.Label>Destination</Form.Label>
           <Form.Input />
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-3">
         <Form.Field {form} name={keys.destinationPort}>
           <Form.Label>Destination Port</Form.Label>
           <Form.Input />
           <Form.Validation />
         </Form.Field>
       </div>
       <div>
         <Form.Field {form} name={keys.protocol}>
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
         <Form.Fieldset {form} name={keys.action}>
           <Form.Legend>Action</Form.Legend>
           <RadioGroup active="variant-filled-secondary">
             {#each actionOptions as action}
               <Form.Radio value={action.value}>{action.label}</Form.Radio>
             {/each}
           </RadioGroup>
           <Form.Validation />
         </Form.Fieldset>
       </div>
       <div>
         <Form.Fieldset {form} name={keys.direction}>
           <Form.Legend>Direction</Form.Legend>
           <RadioGroup active="variant-filled-secondary">
             {#each directionOptions as direction}
               <Form.Radio value={direction.value}>{direction.label}</Form.Radio>
             {/each}
           </RadioGroup>
           <Form.Validation />
         </Form.Fieldset>
       </div>
       <div class="col-span-4">
         <Form.Field {form} name={keys.appId}>
           <Form.Label>App ID</Form.Label>
           <Form.Input />
           <Form.Description>If no app is selected, throttle rate applied system wide.</Form.Description>
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-span-2">
         <Form.Field {form} name={keys.throttleRate}>
           <Form.Label>Bandwidth Limit</Form.Label>
           <RangeSlider bind:value={$form.throttleRate} min={0} max={100} step={1} ticked />
           <Form.Description>{$form.throttleRate} /100</Form.Description>
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="col-end-7">
         <Form.Field {form} name={keys.weight}>
           <Form.Label>Weight</Form.Label>
           <Form.Input type="number" />
           <Form.Validation />
         </Form.Field>
       </div>
       <div class="flex justify-start">
         <Form.Field {form} name={keys.shared}>
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
           Create Rule
         {/if}
       </button>
     </footer>
   </form>
 </section>

 <DebugShell label="form-data">
   <SuperDebug data={$form} />
 </DebugShell>
</div>
