import { rest } from 'msw';

// Mock Data
export const posts = [
	{
		userId: 1,
		id: 1,
		title: 'first post title',
		body: 'first post body'
	},
	{
		userId: 2,
		id: 5,
		title: 'second post title',
		body: 'second post body'
	},
	{
		userId: 3,
		id: 6,
		title: 'third post title',
		body: 'third post body'
	}
];

// TODO: migration guide https://github.com/mswjs/msw/blob/feat/standard-api/MIGRATING.md
// Define handlers that catch the corresponding requests and returns the mock data.
export const handlers = [
	rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
		return res(ctx.status(200), ctx.json(posts));
	}),
	rest.get('http://test.mswjs.io', (req, res, ctx) => {
		return res(
			ctx.status(401),
			ctx.set('x-header', 'yes'),
			ctx.json({
				firstName: 'John',
				age: 32
			})
		);
	}),
	rest.post('https://test.mswjs.io', (req, res, ctx) => {
		return res(ctx.status(403), ctx.set('x-header', 'yes'), ctx.json(req.body as Record<string, any>));
	})
	/*
	rest.get('https://jsonplaceholder.typicode.com/posts', ({ request, params, cookies }) => {
		console.log(params, cookies);
		console.log('Captured %s %s', request.method, request.url);
		return HttpResponse.json(posts, { status: 200 });
	}),
	rest.post('https://prime-iguana-64.hasura.app/v1/graphql', () => {
		return passthrough();
	}),
	rest.get('http://test.mswjs.io', () => {
		return HttpResponse.json(
			{
				firstName: 'John',
				age: 32
			},
			{
				status: 401,
				headers: {
					'X-Header': 'yes'
				}
			}
		);
	}),
	rest.post('https://test.mswjs.io', async ({ request }) => {
		return HttpResponse.json(await request.json(), {
			status: 403,
			headers: {
				'X-Header': 'yes'
			}
		});
	})
	*/
];
