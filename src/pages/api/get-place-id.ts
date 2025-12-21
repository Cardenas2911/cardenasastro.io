export const prerender = false; // Enable Server-Side Rendering for this endpoint

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
        return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Determine user agent
        const userAgent = request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

        const response = await fetch(targetUrl, {
            redirect: 'follow', // Follow short link redirects
            headers: {
                'User-Agent': userAgent, // Emulate browser to avoid bot blocking
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: `Failed to fetch URL: ${response.status}` }), { status: 500 });
        }

        const html = await response.text();

        // Regex to find Google Place IDs (starting with ChIJ) inside the HTML source
        // They often appear as keys in JSON or JS arrays: "ChIJ..."
        // We look for strict alphanumeric strings starting with ChIJ and length ~20-50
        const placeIdRegex = /ChIJ[a-zA-Z0-9_-]{20,40}/g;
        const matches = html.match(placeIdRegex);

        if (matches && matches.length > 0) {
            // Return the first unique match provided it looks reasonably unique
            // Often the main Place ID is repeated most frequently, but first match is usually good enough for these pages
            const uniqueMatches = [...new Set(matches)];

            // Filter out invalid/too short ones just in case regex is loose
            const validMatch = uniqueMatches.find(m => m.length > 20);

            if (validMatch) {
                return new Response(JSON.stringify({ success: true, placeId: validMatch }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        return new Response(JSON.stringify({ error: 'Place ID not found in page content' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
