// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type AI from '@aibrow/dom-types';
// type NhostClient = import('@nhost/nhost-js').NhostClient;
import type { NhostClient } from '@nhost/nhost-js';
import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
import type { ParaglideLocals } from '@inlang/paraglide-sveltekit';
import type { ToastSettings } from '@skeletonlabs/skeleton';

declare global {
  namespace App {
    // houdini session
    interface Session {
      accessToken?: string;
      role?: string;
      orgId?: string;
      userId?: string;
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
    interface Locals {
      paraglide: ParaglideLocals<AvailableLanguageTag>;
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
      adminSecret?: string | null;
    }
  }

  // App version from package.json
  declare const __APP_VERSION__: string;
  // Git commit tag or hash
  declare const __GIT_TAG__: string;
  // Date of last commit
  declare const __GIT_DATE__: string;

  interface WindowOrWorkerGlobalScope {
    readonly aibrow: typeof AI;
  }
}
