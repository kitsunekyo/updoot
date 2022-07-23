import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

import { createContext, createRouter } from "@/server/context";
import { prisma } from "@/server/db/client";

export const appRouter = createRouter()
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
  .mutation("delete-poll", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const deleteOptions = prisma.option.deleteMany({
        where: { pollId: input.id },
      });
      const deletePoll = prisma.poll.delete({
        where: { id: input.id },
      });
      await prisma.$transaction([deleteOptions, deletePoll]);
    },
  })
  .mutation("upvote-option", {
    input: z.string(),
    async resolve({ input }) {
      await prisma.option.update({
        where: { id: input },
        data: { votes: { increment: 1 } },
      });
    },
  })
  .mutation("downvote-option", {
    input: z.string(),
    async resolve({ input }) {
      await prisma.option.update({
        where: { id: input },
        data: { votes: { decrement: 1 } },
      });
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
