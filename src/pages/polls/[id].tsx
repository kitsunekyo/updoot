import Error from "next/error";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

import { MOCK_POLLS } from "../../constants";
import Link from "next/link";

const Poll: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [poll, setPoll] = React.useState(() =>
    MOCK_POLLS.find((p) => p.id === id)
  );

  if (!poll) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="p-6">
      <Link href="/polls">
        <a className="text-blue-600 underline">← See all polls</a>
      </Link>
      <h1 className="text-2xl font-bold">{poll?.title}</h1>
    </div>
  );
};

export default Poll;
