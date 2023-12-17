// https://geoffrich.net/posts/conditionally-stream-data/
export const load = async ({ isDataRequest, fetch }) => {
	const promise: Promise<{
		hello: string;
	}> = fetch('/api/greeting').then((res) => res.json());

	return {
		quick: await fetch('/api/greeting?delay=500').then((res) => res.json()),
		greeting: {
			promise: isDataRequest ? promise : await promise
		}
	};
};
