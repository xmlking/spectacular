<script lang="ts">
  import { goto } from "$app/navigation";
  import * as m from "$i18n/messages";
  import type { PolicySearch } from "$lib/schema/policy";
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
  import { debounce } from "@spectacular/utils";
  import * as Form from "formsnap";
  import type { GraphQLError } from "graphql";
  import {
    LoaderIcon,
    MoreHorizontalIcon,
    ScaleIcon,
    SearchIcon,
    ShieldCheckIcon,
  } from "lucide-svelte";
  import type { FormEventHandler } from "svelte/elements";
  import SuperDebug, {
    superForm,
    type SuperValidated,
  } from "sveltekit-superforms";
  import { type Subject, searchSubjects } from "./search";

  const log = new Logger("policies:search-form:browser");

  export let formInitData: SuperValidated<PolicySearch>;

  // Variables
  const loadingState = getLoadingState();

  // Search form
  const form = superForm(formInitData, {
    dataType: "json",
    taintedMessage: null,
    syncFlashMessage: false,
    resetForm: true,
    onError({ result }) {
      // the onError event allows you to act on ActionResult errors.
      // TODO:
      // message.set(result.error.message)
      log.error("policy superForm error:", { result });
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
  let subjects: Subject[] | undefined;

  // Functions
  async function clearSubject() {
    await goto(
      `/policies?subjectType=${$formData.subjectType}&limit=${$formData.limit}&offset=${$formData.offset}`,
    );
  }

  const onInput: FormEventHandler<HTMLInputElement> = async (event) => {
    const value = event.currentTarget.value;
    console.log(`onInput: ${value}`);
    if (value.length > 3) {
      ({ data: subjects, errors: gqlErrors } = await searchSubjects($formData));
    }
  };

  const onChange: FormEventHandler<HTMLInputElement> = async (event) => {
    const value = event.currentTarget.value;
    console.log(`onChange: ${value}`);
    if (value === "") {
      await clearSubject();
    }
  };

  const onSelect = async (event: CustomEvent<AutocompleteOption<Subject>>) => {
    const value = event.detail.value;
    console.log(`onSelect: ${value}`);
    $formData.subjectId = value.id;
    $formData.subjectDisplayName = value.displayName;
    await goto(
      `/policies?subjectType=${$formData.subjectType}&subjectId=${$formData.subjectId}&subjectDisplayName=${$formData.subjectDisplayName}&limit=${$formData.limit}&offset=${$formData.offset}`,
    );
  };

  // Reactivity
  $: invalid = $allErrors.length > 0;
  $: loadingState.setFormLoading($delayed);
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- GraphQL Errors  -->
<GraphQLErrors errors={gqlErrors} />
<!-- Form -->
<form data-sveltekit-noscroll bind:this={searchForm}>
  <AppBar
    gridColumns="grid-cols-3"
    slotLead="place-content-start !justify-start"
    slotTrail="place-content-end"
  >
    <svelte:fragment slot="lead">
      <ShieldCheckIcon />
      <h3 class="h3 pl-2 hidden md:block">Policies</h3>
    </svelte:fragment>

    <div
      class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
      class:input-error={invalid}
      use:popup={popupSettings}
    >
      <div class="input-group-shim" class:input-error={invalid}>
        <SearchIcon size={17} />
      </div>
      <Form.Field {form} name="subjectDisplayName">
        <Form.Control let:attrs>
          <input
            type="search"
            class="data-[fs-error]:input-error hidden md:block"
            placeholder="Subject Display Name"
            autocomplete="off"
            spellcheck="false"
            autocorrect="off"
            on:change={onChange}
            on:input={onInput}
            {...attrs}
            bind:value={$formData.subjectDisplayName}
          />
        </Form.Control>
      </Form.Field>
      <Form.Field {form} name="subjectType">
        <Form.Control let:attrs>
          <select
            class="data-[fs-error]:input-error"
            bind:value={$formData.subjectType}
            on:change={clearSubject}
            {...attrs}
            {...$constraints.subjectType}
          >
            <option value="user">User</option>
            <option value="group">Group</option>
            <option value="service_account">Service</option>
            <option value="device">Device</option>
            <option value="device_pool">D Pool</option>
          </select>
        </Form.Control>
      </Form.Field>
    </div>
    <div
      class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto z-10"
      data-popup="popupAutocomplete"
      tabindex="-1"
    >
      <Autocomplete
        bind:input={$formData.subjectDisplayName}
        options={subjects?.map((subject) => ({
          label: subject.displayName,
          value: subject,
          keywords: "",
        }))}
        on:selection={onSelect}
      />
    </div>

    <svelte:fragment slot="trail">
      <a
        href="/policies/create"
        class="btn variant-filled"
        data-sveltekit-preload-data="hover">Add Policy</a
      >
    </svelte:fragment>
  </AppBar>
  <input name="subjectId" bind:value={$formData.subjectId} type="hidden" />
  <input name="limit" bind:value={$formData.limit} type="hidden" />
  <input name="offset" bind:value={$formData.offset} type="hidden" />
  <ErrorMessage error={$errors?.subjectType?.[0]} />
  <ErrorMessage error={$errors?.subjectId?.[0]} />
  <ErrorMessage error={$errors?.subjectDisplayName?.[0]} />
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
  <!-- <br />
	<SuperDebug label="$page data" status={false} data={$page} /> -->
</DebugShell>
