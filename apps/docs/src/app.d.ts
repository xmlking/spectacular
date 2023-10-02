// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	namespace Urara {
		interface Post {
			path: string;
			title: string;
		}
		interface Page {}
	}
	// App version from package.json
	declare const __APP_VERSION__: string;
	// Git commit tag or hash
	declare const __GIT_TAG__: string;
	// Date of last commit
	declare const __GIT_DATE__: string;
}

export {};
