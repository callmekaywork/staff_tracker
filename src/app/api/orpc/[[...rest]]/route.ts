import { RPCHandler } from '@orpc/server/fetch';
import { CORSPlugin } from '@orpc/server/plugins';
import { onError } from '@orpc/server';

import { router } from '@/orpc/route';

// app/api/orpc/route.ts

const handler = new RPCHandler(router, {
  plugins: [new CORSPlugin()],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

function headersToObject(headers: Headers): Record<string, string> {
  const obj: Record<string, string> = {};
  headers.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: '/api/orpc',
    context: { headers: headersToObject(request.headers) },
  });

  return response ?? new Response('Not Found', { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
