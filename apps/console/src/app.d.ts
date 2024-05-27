// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

type NhostClient = import('@nhost/nhost-js').NhostClient;
type ToastSettings = import('@skeletonlabs/skeleton').ToastSettings;
type AvailableLanguageTag = import('$i18n/runtime').AvailableLanguageTag;

declare global {
    namespace App {
      // houdini session
      interface Session {
        accessToken?: string;
        // TODO: currentOrg?: string; // active user's org. default value is user's default_org
      }
      namespace Superforms {
        type Message = Pick<ToastSettings, 'message' | 'hideDismiss' | 'timeout'> & {
          type: 'error' | 'success' | 'warning';
        };
      }
      interface Error {
        // e.g., { message: 'Authentication failed.', details: e }
        message: string;
        details?: string | Record<unknown, unknown>;
      }
      interface Locals {
        nhost: NhostClient;
      }
      interface PageData {
        // user?: Omit<User, 'userId'>;
        /**
         * Short-life cookie-persisted flash message.
         */
        flash?: App.Superforms.Message;
      }
      // interface PageState {}
      // interface Platform {}
      interface Metadata {
        logResult?: boolean | null;
        backendToken?: string | null;
        useRole?: string | null;
      }
    }

    // App version from package.json
    declare const __APP_VERSION__: string;
    // Git commit tag or hash
    declare const __GIT_TAG__: string;
    // Date of last commit
    declare const __GIT_DATE__: string;
}

export type {};
