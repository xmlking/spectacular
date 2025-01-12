import Alerts from './form-alerts.svelte';
import ErrorMessage from './form-error.svelte';
import InputPairs from './input-pairs.svelte';
import type { AllowedKeyValues, KeyValueMap } from './input-pairs.svelte';
import InputChipWrapper from './input-chip-wrapper.svelte';
export {
  Alerts,
  ErrorMessage,
  InputPairs,
  InputChipWrapper,
  //
  Alerts as FormAlerts,
  ErrorMessage as FormError,
  InputPairs as FormInputPairs,
  // Types
  type AllowedKeyValues,
  type KeyValueMap,
};
