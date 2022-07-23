import Header from "@/components/Header";
import type { NextPage } from "next";
import Link from "next/link";

import { trpc } from "../../utils/trpc";

const Polls: NextPage = () => {
  const pollsQuery = trpc.useQuery(["polls"]);
  const utils = trpc.useContext();
  const deleteMutation = trpc.useMutation(["delete-poll"], {
    onSuccess() {
      utils.invalidateQueries(["polls"]);
    },
  });

  if (!pollsQuery.data) {
    return (
      <>
        <Header />
        <div className="p-6">
          <p>loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="p-6">
        <Link href="polls/create">
          <a className="text-orange-600 underline">Create Poll</a>
        </Link>
        <h1 className="text-2xl font-bold my-6">Polls</h1>
        <ul className="flex flex-col gap-4">
          {pollsQuery.data.map((poll) => (
            <li key={poll.id}>
              <div className="flex items-center gap-2 justify-between p-4 rounded border bg-gray-600 border-gray-500">
                <Link href={`polls/${poll.id}`}>
                  <a className="text-orange-500 underline">
                    <h3 className="text-medium">{poll.title}</h3>
                  </a>
                </Link>
                <button
                  className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-white/10 ml-2 text-sm"
                  disabled={deleteMutation.isLoading}
                  onClick={() => deleteMutation.mutate({ id: poll.id })}
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Polls;
