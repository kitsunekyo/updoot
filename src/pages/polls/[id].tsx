import Error from "next/error";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";

import { trpc } from "@/utils/trpc";
import Header from "@/components/Header";

const Poll: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const utils = trpc.useContext();
  const pollQuery = trpc.useQuery(["poll-by-id", id as string]);
  const downvoteMutation = trpc.useMutation("downvote-option", {
    onSuccess() {
      utils.invalidateQueries(["poll-by-id", id as string]);
    },
  });
  const upvoteMutation = trpc.useMutation("upvote-option", {
    onSuccess() {
      utils.invalidateQueries(["poll-by-id", id as string]);
    },
  });

  if (pollQuery.isError) {
    return <Error statusCode={404} />;
  }

  if (!pollQuery.data)
    return (
      <div className="p-6">
        <p>loading poll...</p>
      </div>
    );

  // const sortedOptions = [...pollQuery.data.options].sort((a, b) =>
  //   a.votes > b.votes ? -1 : 1
  // );

  const isProcessingVote =
    upvoteMutation.isLoading || downvoteMutation.isLoading;

  return (
    <>
      <Header />
      <div className="p-6">
        <Link href="/polls">
          <a className="text-orange-600 underline">← See all polls</a>
        </Link>
        <h1 className="text-2xl font-bold my-6">{pollQuery.data.title}</h1>
        <ul className="flex flex-col gap-4">
          {pollQuery.data.options.map((o) => (
            <li key={o.id}>
              <div className="flex gap-4 items-center justify-between p-4 rounded border bg-gray-600 border-gray-500">
                <h3>{o.title}</h3>
                <div className="flex gap-2 items-center ml-4">
                  <button
                    onClick={() => upvoteMutation.mutate(o.id)}
                    disabled={isProcessingVote}
                    className="h-8 w-8 flex items-center justify-center rounded bg-green-700/30 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500"
                  >
                    ↑
                  </button>
                  <span className="px-2">{o.votes}</span>
                  <button
                    onClick={() => downvoteMutation.mutate(o.id)}
                    disabled={isProcessingVote}
                    className="h-8 w-8 flex items-center justify-center rounded bg-red-700/30 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-500"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Poll;
