import { ResponseError } from '$lib/errors';
import type { OAuth2TokenRequest, OAuth2TokenResponse } from '$lib/models/types/auth';
import { Logger } from '$lib/utils';

const log = new Logger('lib:authClient');
export class AuthClient {
	#timer: NodeJS.Timeout | undefined;

	#endpoint: string;
	#payload: string;

	#access_token = '';
	#expires_at = Date.now();

	constructor(endpoint: string, payload: OAuth2TokenRequest) {
		this.#endpoint = endpoint;
		this.#payload = new URLSearchParams({ ...payload }).toString();
		(async () => {
			try {
				await this.getAccessToken();
			} catch (e) {
				log.error('cannot get token for:', endpoint);
				log.error(e, (e as Error).stack);
			}
		})();
	}

	private async getAccessToken() {
		const resp = await fetch(this.#endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: this.#payload
		});

		if (!resp.ok) throw new ResponseError('AuthClient: Bad AccessToken response', resp);
		const response: OAuth2TokenResponse = await resp.json();
		const { access_token, expires_in } = response;
		log.info('storing token for backend:', this.#endpoint, expires_in);
		this.#access_token = access_token;
		this.#expires_at = Date.now() + expires_in * 1000;

		if (this.#timer) {
			clearTimeout(this.#timer);
		}
		this.#timer = setTimeout(() => this.getAccessToken(), expires_in * 1000 * 0.9);
	}

	public getToken() {
		if (this.#expires_at > Date.now()) {
			return this.#access_token;
		} else {
			throw Error('token not initialized or expaired');
		}
	}
}
