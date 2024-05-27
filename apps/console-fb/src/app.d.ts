// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import 'vite-plugin-pwa/svelte';
import 'vite-plugin-pwa/info';
import 'vite-plugin-pwa/pwa-assets';

import { DefaultSession } from '@auth/core/types';
declare global {
  namespace App {
    interface Session {
      user?: {
        id?: string;
      } & DefaultSession['user'];
      expires?: DefaultSession['expires'];
      token?: string;
      roles?: string[];
    }
    interface Error {
      message: string; // this property is always required, to provide a sensible fallback
      context?: Record<string, any>;
    }
    interface Locals {
      // session: Session;
      auth(): Promise<Session | null>;
    }
    export interface Toast {
      message: string;
      type?: ToastLevel;
      duration?: number;
      dismissible?: boolean;
    }
    interface PageData {
      session: Session | null;
      flash?: Toast;
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

export {};
