import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.context().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? 'World'}`,
      };
    }),
});

export type AppRouter = typeof appRouter;
