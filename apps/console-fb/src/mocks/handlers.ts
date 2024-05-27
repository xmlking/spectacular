// import { http, graphql, HttpResponse } from 'msw';
import { http, HttpResponse } from 'msw';

// Mock Data
export const posts = [
    {
        userId: 1,
        id: 1,
        title: 'first post title',
        body: 'first post body',
    },
    {
        userId: 2,
        id: 5,
        title: 'second post title',
        body: 'second post body',
    },
    {
        userId: 3,
        id: 6,
        title: 'third post title',
        body: 'third post body',
    },
];

// TODO: migration guide https://github.com/mswjs/msw/blob/feat/standard-api/MIGRATING.md
// Define handlers that catch the corresponding requests and returns the mock data.
export const handlers = [
    http.get('https://jsonplaceholder.typicode.com/posts', async () => {
        return HttpResponse.json(posts, { status: 200 });
    }),
    http.get('http://test.mswjs.io', async ({ request, params }) => {
        console.log('Intercepted %s %s', request.method, request.url);
        console.log('Request path parameters:', params);
        return HttpResponse.json(
            {
                firstName: 'John',
                age: 32,
            },
            {
                status: 401,
                headers: {
                    'X-Modified-Header': 'true',
                },
            },
        );
    }),
    http.post('https://test.mswjs.io', async ({ request }) => {
        const data = await request.json();
        return HttpResponse.json(data, {
            status: 403,
            headers: {
                'x-header': 'yes',
            },
        });
    }),
    /*
	http.get('https://jsonplaceholder.typicode.com/posts', ({ request, params, cookies }) => {
		console.log(params, cookies);
		console.log('Captured %s %s', request.method, request.url);
		return HttpResponse.json(posts, { status: 200 });
	}),
	http.post('https://prime-iguana-64.hasura.app/v1/graphql', () => {
		return passthrough();
	}),
	http.get('http://test.mswjs.io', () => {
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
	http.post('https://test.mswjs.io', async ({ request }) => {
		return HttpResponse.json(await request.json(), {
			status: 403,
			headers: {
				'X-Header': 'yes'
			}
		});
	})
	*/
    // graphql.mutation('CreateUser', async ({ request, query, variables }) => {
    // 	console.log('Request request:', request);
    // 	console.log('Request query:', query);
    // 	console.log('Request variables:', variables);
    // 	return new Response(
    // 		JSON.stringify({
    // 			data: {
    // 				user: {
    // 					id: 'abc-123',
    // 					firstName: variables.firstName
    // 				}
    // 			}
    // 		}),
    // 		{
    // 			headers: {
    // 				'Content-Type': 'application/json'
    // 			}
    // 		}
    // 	);
    // })
];
