import type { NextPage } from "next";
import Link from "next/link";

import { trpc } from "../../utils/trpc";

const Polls: NextPage = () => {
  const pollsQuery = trpc.useQuery(["polls"]);
  if (!pollsQuery.data) return <p>loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Polls</h1>
      <Link href="polls/create">
        <a className="text-blue-600 underline">Create Poll</a>
      </Link>
      <ul className="list-disc">
        {pollsQuery.data.map((poll) => (
          <li key={poll.id} className="ml-6">
            <Link href={`polls/${poll.id}`}>
              <a className="text-blue-500 underline">
                <h3 className="text-medium">{poll.title}</h3>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Polls;
