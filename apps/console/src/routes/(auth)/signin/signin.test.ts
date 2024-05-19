// Ref: https://github.com/hanshoi/sveltekit-nhost-houdini-example/blob/master/src/routes/(public)/login/login.test.ts
// TODO https://testing-library.com/docs/svelte-testing-library/setup/
// TODO https://www.freecodecamp.org/news/how-to-do-test-driven-development-with-svelte-and-vitest/

import { describe, it, beforeEach } from 'vitest';
// import { render, screen, fireEvent } from '@testing-library/svelte';
import Signin from './+page.svelte';

describe('signin form', () => {
	beforeEach(() => {});

	it('renders page', async () => {});
	it('with generic error message', async () => {});
	it('with unverified email error message', async () => {});
	it('success and redirect', async () => {});
});
