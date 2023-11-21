import { error, json, text } from '@sveltejs/kit';

// Ref: https://github.com/WayneMorganUK/discord_auth/tree/0b7364d24263b479ce2292a218f98a2a5c4786d2/src/routes/api

export async function GET({ url }) {
	// export async function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	const max = Number(url.searchParams.get('max') ?? '1');

	const d = max - min;

	if (isNaN(d) || d < 0) {
		throw error(400, { message: 'min and max must be numbers, and min must be less than max' });
	}

	const random = min + Math.random() * d;

	return text(String(random));
}

export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}
