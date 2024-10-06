

export const prerender = true;

export async function GET({ setHeaders }) {
  setHeaders({
    'Content-Type': 'application/json',
  });

  // ref: https://web.dev/articles/webauthn-related-origin-requests
  const json = {
    origins: [
      'https://console.traefik.me:5173',
      'https://console.traefik.me:3000',
      'https://console.traefik.me',
      'https://spectacular-console.vercel.app',
      'https://spectacular-console-git-main-spectacular.vercel.app',
    ],
  };

  return new Response(JSON.stringify(json));
}
