import { env as dynPriEnv } from '$env/dynamic/private';
import { getToken } from '@auth/core/jwt';

// Ref: https://github.com/WayneMorganUK/discord_auth/tree/0b7364d24263b479ce2292a218f98a2a5c4786d2/src/routes/api

export async function GET({ request, fetch }) {
	const token = await getToken({ req: request, secret: dynPriEnv.AUTH_SECRET, raw: true });
	const res = await fetch('https://graph.microsoft.com/v1.0/me/photos/48x48/$value', {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'image/jpg'
		}
	});

	const data = await res.arrayBuffer();
	const pictureBase64 = Buffer.from(data).toString('base64');
	return new Response(String(`data:image/jpeg;base64, ${pictureBase64}`));
}
