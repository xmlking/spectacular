import type { ParamMatcher } from '@sveltejs/kit';
export const URN_REGEX = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

export const match = ((param) => {
  return URN_REGEX.test(param);
}) satisfies ParamMatcher;
