<script lang="ts">
import { goto } from "$app/navigation";
import type { RuleSearch } from "$lib/schema/rule";
import { getLoadingState } from "$lib/stores/loading";
import {
  AppBar,
  Autocomplete,
  type AutocompleteOption,
  type PopupSettings,
  popup,
} from "@skeletonlabs/skeleton";
import { DebugShell, GraphQLErrors } from "@spectacular/skeleton/components";
import { Alerts, ErrorMessage } from "@spectacular/skeleton/components/form";
import { Logger } from "@spectacular/utils";
import * as Form from "formsnap";
import type { GraphQLError } from "graphql";
import { SearchIcon } from "lucide-svelte";
import type { FormEventHandler } from "svelte/elements";
import SuperDebug, {
  superForm,
  type SuperValidated,
} from "sveltekit-superforms";
import { searchRules, type Rule } from "./search";

const log = new Logger("rules:search-form:browser");

export let formInitData: SuperValidated<RuleSearch>;

// Variables
const loadingState = getLoadingState();

// Search form
const form = superForm(formInitData, {
  dataType: "json",
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  onError({ result }) {
    log.error("rule superForm error:", { result });
  },
});
const {
  form: formData,
  delayed,
  allErrors,
  errors,
  constraints,
  message,
  tainted,
  posted,
  submitting,
  timeout,
} = form;

let searchForm: HTMLFormElement;

const popupSettings: PopupSettings = {
  event: "focus-click",
  target: "popupAutocomplete",
  placement: "bottom",
};

let gqlErrors: Partial<GraphQLError>[] | undefined;
let rules: Rule[] | undefined;

// Functions
const onInput: FormEventHandler<HTMLInputElement> = async (event) => {
  const value = event.currentTarget.value;
  console.log(`onInput: ${value}`);
  if (value.length > 3) {
    ({ data: rules, errors: gqlErrors } = await searchRules($formData));
  }
};

const onChange: FormEventHandler<HTMLInputElement> = async (event) => {
  const value = event.currentTarget.value;
  console.log(`onChange: ${value}`);
  if (value === "") {
    await goto(`/rules?limit=${$formData.limit}&offset=${$formData.offset}`);
  }
};

const onSelect = async (event: CustomEvent<AutocompleteOption<Rule>>) => {
  const value = event.detail.value;
  console.log(`onSelect: ${value}`);
  $formData.displayName = value.displayName;
  await goto(
    `/rules?displayName=${$formData.displayName}&limit=${$formData.limit}&offset=${$formData.offset}`
  );
};

// Reactivity
$: invalid = $allErrors.length > 0;
$: loadingState.setFormLoading($delayed);
</script>

<form data-sveltekit-noscroll bind:this={searchForm}>
  <AppBar
    gridColumns="grid-cols-3"
    slotLead="place-content-start !justify-start"
    slotTrail="place-content-end"
  >
    <svelte:fragment slot="lead">
      <h3 class="h3 pl-2 hidden md:block">Rules</h3>
    </svelte:fragment>

    <div
      class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
      class:input-error={invalid}
      use:popup={popupSettings}
    >
      <div class="input-group-shim" class:input-error={invalid}>
        <SearchIcon size={17} />
      </div>
      <Form.Field {form} name="displayName">
        <Form.Control let:attrs>
          <input
            type="search"
            class="data-[fs-error]:input-error hidden md:block"
            placeholder="Rule Display Name"
            autocomplete="off"
            spellcheck="false"
            autocorrect="off"
            on:change={onChange}
            on:input={onInput}
            {...attrs}
            bind:value={$formData.displayName}
          />
        </Form.Control>
      </Form.Field>
    </div>
    <div
      class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto z-10"
      data-popup="popupAutocomplete"
      tabindex="-1"
    >
      <Autocomplete
        bind:input={$formData.displayName}
        options={rules?.map((rule) => ({
          label: rule.displayName,
          value: rule,
          keywords: "",
        }))}
        on:selection={onSelect}
      />
    </div>

    <svelte:fragment slot="trail">

        href="/rules/create"
        class="btn variant-filled"
        data-sveltekit-preload-data="hover"
        <a href="">Add Rule</a>
    </svelte:fragment>
  </AppBar>
  <input name="limit" bind:value={$formData.limit} type="hidden" />
  <input name="offset" bind:value={$formData.offset} type="hidden" />
  <ErrorMessage error={$errors?.displayName?.[0]} />
  <ErrorMessage error={$errors?.limit?.[0]} />
  <ErrorMessage error={$errors?.offset?.[0]} />
</form>

<DebugShell label="form-data">
  <SuperDebug
    label="Miscellaneous"
    status={false}
    data={{
      message: $message,
      submitting: $submitting,
      delayed: $delayed,
      posted: $posted,
    }}
  />
  <br />
  <SuperDebug label="Form" data={$formData} />
  <br />
  <SuperDebug label="Tainted" status={false} data={$tainted} />
  <br />
  <SuperDebug label="Errors" status={false} data={$errors} />
  <br />
  <SuperDebug label="Constraints" status={false} data={$constraints} />
</DebugShell>
