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

  const downvote = (optionId: string) => {
    downvoteMutation.mutate(optionId);
  };

  const upvote = (optionId: string) => {
    upvoteMutation.mutate(optionId);
  };

  if (pollQuery.isError) {
    return <Error statusCode={404} />;
  }

  if (!pollQuery.data)
    return (
      <div className="p-6">
        <p>loading poll...</p>
      </div>
    );

  return (
    <div className="p-6">
      <Link href="/polls">
        <a className="text-blue-600 underline">← See all polls</a>
      </Link>
      <h1 className="text-2xl font-bold my-6">{pollQuery.data.title}</h1>
      <h3 className="font-bold my-2">Options</h3>
      <ul className="inline-flex flex-col gap-4">
        {pollQuery.data.options.map((o) => (
          <li key={o.id}>
            <div className="flex gap-4 items-center justify-between bg-white p-4 rounded border border-gray-300">
              <h3>{o.title}</h3>
              <div className="flex gap-2 items-center ml-4">
                <button
                  onClick={() => upvote(o.id)}
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                >
                  ↑
                </button>
                {o.votes}
                <button
                  onClick={() => downvote(o.id)}
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
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
