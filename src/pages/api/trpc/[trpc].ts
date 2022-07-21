import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const appRouter = trpc
  .router()
  .query("polls", {
    async resolve() {
      return await prisma.poll.findMany();
    },
  })
  .query("poll-by-id", {
    input: z.string(),
    async resolve({ input }) {
      const poll = await prisma.poll.findFirst({
        where: { id: input },
        include: {
          options: {
            select: {
              id: true,
              title: true,
              votes: true,
            },
          },
        },
      });
      if (!poll) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "Could not find poll",
        });
      }
      return poll;
    },
  })
  .mutation("create-poll", {
    input: z.object({
      title: z.string(),
      options: z.array(
        z.object({
          title: z.string(),
        })
      ),
    }),
    async resolve({ input }) {
      const poll = await prisma.poll.create({
        data: {
          title: input.title,
          options: {
            createMany: {
              data: input.options,
            },
          },
        },
      });
      return poll;
    },
  })
  .mutation("upvote-option", {
    input: z.string(),
    resolve() {
      // todo: increase vote counter on option
    },
  })
  .mutation("downvote-option", {
    input: z.string(),
    resolve() {
      // todo: decrease vote counter on option
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
