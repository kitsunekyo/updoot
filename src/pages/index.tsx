import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import Header from "@/components/Header";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>updoot</title>
        <meta name="description" content="updoot vote app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="p-6 text-center text-2xl font-medium">
        <Link href="/polls">
          <a className="text-orange-600 underline">All polls</a>
        </Link>
      </div>
    </>
  );
};

export default Home;
