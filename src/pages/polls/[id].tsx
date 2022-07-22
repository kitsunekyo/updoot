import Error from "next/error";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";

import { trpc } from "../../utils/trpc";

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

  const sortedOptions = [...pollQuery.data.options].sort((a, b) =>
    a.votes > b.votes ? -1 : 1
  );

  return (
    <div className="p-6">
      <Link href="/polls">
        <a className="text-blue-600 underline">← See all polls</a>
      </Link>
      <h1 className="text-2xl font-bold my-6">{pollQuery.data.title}</h1>
      <ul className="inline-flex flex-col gap-4">
        {sortedOptions.map((o) => (
          <li key={o.id}>
            <div className="flex gap-4 items-center justify-between bg-white p-4 rounded border border-gray-300">
              <h3>{o.title}</h3>
              <div className="flex gap-2 items-center ml-4">
                <button
                  onClick={() => upvoteMutation.mutate(o.id)}
                  disabled={upvoteMutation.isLoading}
                  className="h-8 w-8 flex items-center justify-center rounded bg-green-50 hover:bg-green-100 disabled:bg-gray-50"
                >
                  ↑
                </button>
                {o.votes}
                <button
                  onClick={() => downvoteMutation.mutate(o.id)}
                  disabled={downvoteMutation.isLoading}
                  className="h-8 w-8 flex items-center justify-center rounded bg-red-50 hover:bg-red-100 disabled:bg-gray-50"
                >
                  ↓
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Poll;
