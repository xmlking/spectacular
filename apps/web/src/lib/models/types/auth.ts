export interface OAuth2TokenRequest {
	client_id: string;
	client_secret: string;
	grant_type: string;
	// scope: string;
	scope?: string;
	resource?: string;
}

export interface OAuth2TokenResponse {
	access_token: string;
	expires_in: number;
	refresh_expires_in: number;
	token_type: string;
	"not-before-policy": number;
	scope: string;
}
