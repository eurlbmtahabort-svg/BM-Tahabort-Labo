import { ExecutionContext, D1Database } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // If request is for API, we can handle or pass through
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'API endpoint handled by Cloudflare Pages functions' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not Found', { status: 404 });
  }
};
