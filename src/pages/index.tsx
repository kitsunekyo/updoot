import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>updoot</title>
        <meta name="description" content="updoot vote app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="p-6">
        <Link href="/polls">
          <a className="text-blue-600 underline">All polls</a>
        </Link>
      </div>
    </div>
  );
};

export default Home;
