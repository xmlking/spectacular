import crypto from 'node:crypto';

export function base64URLEncode(input: string | Buffer) {
	return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
export function sha256(input: string | Buffer) {
	return crypto.createHash('sha256').update(input).digest();
}

export default function pkceChallenge(length = 43): {
	code_verifier: string;
	code_challenge: string;
} {
	if (length < 43 || length > 128) {
		throw `Expected a length between 43 and 128. Received ${length}.`;
	}

	const verifier = base64URLEncode(crypto.pseudoRandomBytes(length));
	const challenge = base64URLEncode(sha256(verifier));

	return {
		code_verifier: verifier,
		code_challenge: challenge
	};
}
