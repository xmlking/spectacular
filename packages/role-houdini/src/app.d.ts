export type {};

declare global {
  namespace App {
    interface Session {
      accessToken?: string;
    }
    interface Metadata {
      logResult?: boolean | null;
      backendToken?: string | null;
      useRole?: string | null;
      adminSecret?: string | null;
    }
  }
}
