import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from '@zenith/api';

const app = new Hono();

// tRPC endpoint
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: () => ({}),
  })
);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

const port = Number(process.env.PORT) || 3000;

console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
