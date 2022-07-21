import Error from "next/error";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";

import { trpc } from "../../utils/trpc";

const Poll: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (typeof id !== "string") return <Error statusCode={404} />;
  const pollQuery = trpc.useQuery(["poll-by-id", id]);

  if (pollQuery.isError) {
    return <Error statusCode={404} />;
  }

  if (!pollQuery.data) return <p>loading...</p>;

  return (
    <div className="p-6">
      <Link href="/polls">
        <a className="text-blue-600 underline">← See all polls</a>
      </Link>
      <h1 className="text-2xl font-bold">{pollQuery.data.title}</h1>
      <h3 className="font-bold">Options</h3>
      <ul className="list-disc">
        {pollQuery.data.options.map((o) => (
          <li key={o.id} className="mb-2 ml-6">
            {o.title} - {o.votes}{" "}
            <div className="flex gap-2">
              <button className="px-3 rounded border border-gray-300 hover:bg-gray-100">
                ↑
              </button>
              <button className="px-3 rounded border border-gray-300 hover:bg-gray-100">
                ↓
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Poll;
