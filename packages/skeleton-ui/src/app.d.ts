// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

type NhostClient = import('@nhost/nhost-js').NhostClient;
type ToastSettings = import('@skeletonlabs/skeleton').ToastSettings;

declare global {
  namespace App {
    namespace Superforms {
      type Message = Pick<ToastSettings, 'message' | 'hideDismiss' | 'timeout'> & {
        type: 'error' | 'success' | 'warning';
      };
    }
    // interface Error {}
    interface Locals {
      /**
       * Client's language as determined by the i18n middleware.
       */
      lang: AvailableLanguageTag;
      nhost: NhostClient;
    }
    interface PageData {
      /**
       * Client-forwarded locals.lang.
       */
      lang: App.Locals['lang'];
      // user?: Omit<User, 'userId'>;
      /**
       * Short-life cookie-persisted flash message.
       */
      flash?: App.Superforms.Message;
    }
    // interface PageState {}
    // interface Platform {}
  }

  // App version from package.json
  declare const __APP_VERSION__: string;
  // Git commit tag or hash
  declare const __GIT_TAG__: string;
  // Date of last commit
  declare const __GIT_DATE__: string;
}

export {};
