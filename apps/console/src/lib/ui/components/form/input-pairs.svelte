<script context="module" lang="ts">
export type AllowedKeyValues<K extends string, V extends readonly (string | number | boolean)[]> = Record<K, V>;
export type KeyValueRecord<KV extends AllowedKeyValues<string, readonly (string | number | boolean)[]>> = Record<
  keyof KV,
  KV[keyof KV][number]
>;
</script>
<!--
@component InputPairs - allow users to input allowed key:value pairs
  @prop {AllowedKeyValues} allowedKeyValues
  @prop {Record<string, readonly (string | number | boolean)>} value -  Record with user selected key:value pairs.

  Usage:
  ```svelte
    import  { InputPairs, type KeyValueRecord } from '$lib/ui/components/form';

    const allowedKeyValues = {
      name: ['John', 'Jane', 'Alice', 'Bob'] as const,
      age: [20, 25, 30, 35] as const,
      active: [true, false] as const,
      city: ['New York', 'Los Angeles', 'Chicago', 'Houston'] as const,
      country: ['USA', 'Canada', 'UK', 'India'] as const,
    } as const;

    let value: KeyValueRecord<typeof allowedKeyValues> = {}
    value['name'] = 'John';
    value['age'] = 25;
    value['active'] = true;
    <InputPairs {allowedKeyValues}  bind:value chips="variant-filled-secondary" />
    <pre>{JSON.stringify(value)}</pre>
  ```
-->
<script lang="ts">
  // import { SvelteMap } from 'svelte/reactivity';
  // TODO: add/remove animation like input-chips
  import { fly, scale, slide } from "svelte/transition";
  import { onMount, onDestroy } from "svelte";

  export let allowedKeyValues: AllowedKeyValues<
    string,
    readonly (string | number | boolean)[]
  >;
  export let value: KeyValueRecord<typeof allowedKeyValues> | null;
  export let chips = "variant-filled";

  let currentInput = "";
  let allowedKey = Object.keys(allowedKeyValues);
  let showSuggestions = false;
  let suggestions: (string | number | boolean)[] = [];
  let inputElement: HTMLInputElement;
  let containerElement: HTMLDivElement;

  function addKeyValuePair() {
    const [key, val] = currentInput.split(":").map((s) => s.trim());
    if (key && val) {
       // when value is set to null from parent, set it to empty Map befor adding key
      value = value ?? {}
      value[key] = convertToType(val)
      // Force Svelte to detect the change by reassigning the Record
      value = value;
      currentInput = "";
      suggestions = [];
      inputElement.focus();
    }
  }
  function convertToType(str: string) {
    // Check for boolean values
    if (str.toLowerCase() === "true") {
      return true;
    } else if (str.toLowerCase() === "false") {
      return false;
    }

    // Check for numbers
    const num = Number(str);
    if (!isNaN(num)) {
      return num;
    }

    // Return the string as is
    return str;
  }

  function updateSuggestions() {
    const [key, value] = currentInput.split(":").map((s) => s.trim());
    if (!currentInput.includes(":")) {
      // Suggest keys
      // suggestions = Object.keys(allowedKeyValues).filter(k => k.toLowerCase().startsWith(currentInput.toLowerCase()));
      suggestions = allowedKey.filter((k) =>
        k.trim().toLowerCase().startsWith(currentInput.toLowerCase()),
      );
    } else if (key in allowedKeyValues) {
      // Suggest values
      suggestions = allowedKeyValues[key].filter((v) =>
        v.toString().toLowerCase().startsWith(value.toLowerCase()),
      );
    } else {
      suggestions = [];
    }
    showSuggestions = suggestions.length > 0;
  }

  function selectSuggestion(suggestion: string | number | boolean) {
    if (!currentInput.includes(":")) {
      currentInput = `${suggestion}: `;
      updateSuggestions(); // Automatically suggest values after key is selected
    } else {
      const [key] = currentInput.split(":").map((s) => s.trim());
      currentInput = `${key}: ${suggestion}`;
      showSuggestions = false;
      addKeyValuePair(); // Automatically add key:value token
    }
    inputElement.focus();
  }

  function removeKeyValuePair(key: string) {
    value && delete value[key]
    // Force Svelte to detect the change by reassigning the Record
    value = value;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    // Prevent default behavior
      event.preventDefault();
      addKeyValuePair();
  }

  // Reset Form
  function resetFormHandler() {
    value =  {};
  }

  // Pruned RestProps
  function prunedRestProps() {
    delete $$restProps.class;
    return $$restProps;
  }

  function handleClickOutside(event: MouseEvent) {
    if (containerElement && !containerElement.contains(event.target as Node)) {
      showSuggestions = false;
    }
  }

  onMount(() => {
    document.addEventListener("click", handleClickOutside);

    // Verify external form is present
    if (!inputElement.form) return;
    const externalForm = inputElement.form as HTMLFormElement;
    // Attach reset event listener to external form
    externalForm.addEventListener("reset", resetFormHandler);
    // Return onDestroy handler that will remove the event listener from the external form
    return () => {
      externalForm.removeEventListener("reset", resetFormHandler);
    };
  });

  onDestroy(() => {
    document.removeEventListener("click", handleClickOutside);
  });
</script>

<div
  bind:this={containerElement}
  class="relative input-chip textarea cursor-pointer p-2 rounded-container-token"
  class:opacity-50={$$restProps.disabled}
>
  <!-- Chip Wrapper -->
  <div class="input-chip-wrapper space-y-4">
    <!-- Input Field -->
    <input
      class="input-chip-field unstyled bg-transparent border-0 !ring-0 p-0 w-full"
      type="text"
      placeholder={$$restProps.placeholder ?? "Enter Key: Value"}
      bind:value={currentInput}
      on:input={() => updateSuggestions()}
      on:keydown={handleKeyDown}
      on:focus
      on:blur
      bind:this={inputElement}
      disabled={$$restProps.disabled}
      {...prunedRestProps()}
    />
    <!-- Chip List -->
    {#if value && Object.keys(value).length > 0}
      <div class="input-chip-list flex flex-wrap gap-2">
        {#each Object.entries(value) as [key, val]}
          <!-- Wrapping div required for FLIP animation -->
          <div>
            <button
              type="button"
              disabled={$$restProps.disabled}
              on:click={() => removeKeyValuePair(key)}
              on:click
              on:keypress
              on:keydown
              on:keyup
              class="chip {chips}"
            >
              <span>{key}: {val}</span>
              <span>✕</span>
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Dropdown Values -->
  {#if showSuggestions}
    <ul
      class="absolute z-10 mt-3 w-full bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto"
      transition:slide
    >
      {#each suggestions as suggestion, i}
        <button
          type="button"
          class="w-full px-4 py-2 text-left hover:bg-slate-200 transition-colors"
          on:click={() => selectSuggestion(suggestion)}
        >
          {suggestion}
        </button>
      {/each}
    </ul>
  {/if}
</div>
