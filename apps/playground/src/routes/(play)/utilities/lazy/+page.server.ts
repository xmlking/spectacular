// https://geoffrich.net/posts/conditionally-stream-data/
export const load = async ({ isDataRequest, fetch }) => {
	const promise: Promise<{
		hello: string;
	}> = fetch('/api/greeting').then((res) => res.json());

	return {
		greeting: {
			promise: isDataRequest ? promise : await promise
		}
	};
};
