/**
 * myFetch
 * Ref: https://www.builder.io/blog/safe-data-fetching
 */

const isPlainObject = (value: unknown) => value?.constructor === Object;

export class ResponseError extends Error {
  response: Response;

  constructor(message: string, res: Response) {
    super(message);
    this.response = res;
  }
}

export async function myFetch<Type = any>(input: RequestInfo | URL, init?: RequestInit) {
  let initOptions = init;
  // If we specified a RequestInit for fetch
  if (initOptions?.body) {
    // If we have passed a body property and it is a plain object or array
    if (Array.isArray(initOptions.body) || isPlainObject(initOptions.body)) {
      // Create a new options object serializing the body and ensuring we
      // have a content-type header
      initOptions = {
        ...initOptions,
        body: JSON.stringify(initOptions.body),
        headers: {
          'Content-Type': 'application/json',
          ...initOptions.headers,
        },
      };
    }
  }

  const res = await fetch(input, initOptions);
  if (!res.ok) {
    throw new ResponseError('Bad response', res);
  }
  return (await res.json()) as Type;
}

// biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
export function handleError(err: unkown) {
  // Safe to our choice of logging service
  console.log(err);

  if (err instanceof ResponseError) {
    switch (err.response.status) {
      case 401:
        // Prompt the user to log back in
        console.log('Prompt the user to log back in');
        break;
      case 500:
        // Show user a dialog to apologize that we had an error and to
        // try again and if that doesn't work contact support
        console.log('Show user a dialog to apologize that we had an error');
        break;
      default:
        // Show
        throw new Error('Unhandled fetch response', { cause: err });
    }
  }
  throw new Error('Unknown fetch error', { cause: err });
}

/**
 * in-source testing
 * RUN: turbo run test --filter=@spectacular/utils
 */

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  interface Person {
    name: string;
    username: string;
    email: string;
  }

  it('test myFetch', async () => {
    try {
      const person = await myFetch<Person>('https://jsonplaceholder.typicode.com/users/1');
      expect(person.username).toBe('Bret');
    } catch (err) {
      if (err instanceof ResponseError) {
        if (err.response.status === 404) {
          // Special logic unique to this call where we want to handle this status,
          // like to say on a 404 that we seem to not have this user
          return;
        }
      }
      // ⬇️ Handle anything else that we don't need special logic for, and just want
      // our default handling
      handleError(err);
      return;
    }
  });
}
