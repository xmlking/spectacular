import fetch from 'cross-fetch';

it('returns a mocked response to a GET request using fetch', async () => {
  const res = await fetch('http://test.mswjs.io');

  expect(res.status).toEqual(401);
  expect(res.headers.get('content-type')).toEqual('application/json');
  expect(res.headers.get('x-header')).toEqual('yes');

  expect(await res.json()).toEqual({
    firstName: 'John',
    age: 32,
  });
});

it('returns a mocked response to a POST request using fetch', async () => {
  const res = await fetch('https://test.mswjs.io', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payload: 'info',
    }),
  });

  expect(res.status).toEqual(403);
  expect(res.status).toBe(403);
  expect(res.headers.get('content-type')).toEqual('application/json');
  expect(res.headers.get('x-header')).toEqual('yes');
  expect(await res.json()).toEqual({
    payload: 'info',
  });
});
