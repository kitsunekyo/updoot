import type { NextPage } from "next";
import Link from "next/link";
import React from "react";

const CreatePoll: NextPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e.currentTarget);
  };

  return (
    <div className="p-6">
      <Link href="/polls">
        <a className="text-blue-600 underline">← See all polls</a>
      </Link>
      <h1 className="text-2xl font-bold">Create Poll</h1>
      <form onSubmit={handleSubmit}>
        <div className="my-6">
          <label htmlFor="title" className="block">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="border border-gray-300 rounded h-12 px-4"
          />
        </div>
        <div className="my-6">
          <label htmlFor="options" className="block">
            Options
          </label>
          <ul className="list-disc">
            <li className="ml-6 mb-2">
              <input
                type="text"
                name="option1"
                id="option1"
                className="border border-gray-300 rounded h-12 px-4"
              />
            </li>
            <li className="ml-6 mb-2">
              <input
                type="text"
                name="option2"
                id="option2"
                className="border border-gray-300 rounded h-12 px-4"
              />
            </li>
          </ul>
        </div>
        <div className="my-6">
          <button className="bg-blue-600 text-white rounded px-6 h-12">
            Create Poll
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePoll;
