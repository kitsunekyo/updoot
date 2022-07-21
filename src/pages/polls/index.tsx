import type { NextPage } from "next";
import Link from "next/link";

import { MOCK_POLLS } from "../../constants";

const Polls: NextPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Polls</h1>
      <Link href="polls/create">
        <a className="text-blue-600 underline">Create Poll</a>
      </Link>
      <ul className="list-disc">
        {MOCK_POLLS.map((poll) => (
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
