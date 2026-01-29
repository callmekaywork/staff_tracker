import type { RouterClient } from '@orpc/server';
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { router } from './route';

// const link = new RPCLink({
//   url: 'http://127.0.0.1:3000',
//   headers: { Authorization: 'Bearer token' },
// });

const client = new RPCLink({
  url: () => {
    if (typeof window === 'undefined') {
      throw new Error('RPCLink is not allowed on the server side');
    }

    // return `${window.location.origin}/rpc`;
    return 'http://localhost:3000/api/orpc'; // just the prefix
  },
  // url: 'http://127.0.0.1:3000/api/orpc',
  headers: { Authorization: 'Bearer token' },
});

export const orpc: RouterClient<typeof router> = createORPCClient(client);
