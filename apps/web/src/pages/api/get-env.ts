export const prerender = false;

// import { Response } from 'astro/runtime';

export async function GET() {
    const siteUrl = process.env.SITE_URL;

    const responseBody = JSON.stringify({
        siteUrl,
    });

    return new Response(responseBody, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 's-maxage=1, stale-while-revalidate',
        },
    });
}
