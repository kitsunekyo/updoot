import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

import { MOCK_POLLS } from "../../../constants";

export const appRouter = trpc
  .router()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("polls", {
    resolve() {
      return MOCK_POLLS;
    },
  })
  .query("poll-by-id", {
    input: z.string(),
    resolve({ input }) {
      const poll = MOCK_POLLS.find((p) => p.id === input);
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
      option: z.array(
        z.object({
          title: z.string(),
        })
      ),
    }),
    resolve() {
      // todo: persist poll and options
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
