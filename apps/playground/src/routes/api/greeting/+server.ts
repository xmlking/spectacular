import { json } from '@sveltejs/kit';

export const GET = async () => {
	await new Promise((res) => setTimeout(res, 1500));
	return json({
		hello: 'world'
	});
};
