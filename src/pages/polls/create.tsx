import Header from "@/components/Header";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { trpc } from "../../utils/trpc";

const CreatePoll: NextPage = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const createMutation = trpc.useMutation(["create-poll"], {
    onSuccess() {
      utils.invalidateQueries(["polls"]);
    },
  });
  const [title, setTitle] = React.useState("");
  const [options, setOptions] = React.useState<{ title: string }[]>([
    { title: "" },
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const createPollPayload = {
      title,
      options: options.filter((o) => o.title !== ""),
    };

    if (createPollPayload.options.length <= 0) {
      console.error("need at least 1 option");
      return;
    }

    await createMutation.mutateAsync(createPollPayload);
    router.push("/polls");
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOptions = [...options];
    newOptions[index].title = e.currentTarget.value;
    setOptions(newOptions);
  };

  const handleOptionFocus = (index: number) => {
    if (options.length - 1 === index) {
      setOptions((options) => [...options, { title: "" }]);
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((o) => options.indexOf(o) !== index));
  };

  return (
    <>
      <Header />
      <div className="p-6">
        <Link href="/polls">
          <a className="text-orange-600 underline">← See all polls</a>
        </Link>
        <h1 className="text-2xl font-bold my-6">Create Poll</h1>
        <form onSubmit={handleSubmit}>
          <div className="my-6">
            <label htmlFor="title" className="block">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="border border-gray-300 rounded h-12 px-4 text-black"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </div>
          <div className="my-6">
            <label htmlFor="options" className="block">
              Options
            </label>
            <ul>
              {options.map((o, i) => (
                <li key={i} className="mb-2">
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      name={`option-${i}`}
                      id={`option-${i}`}
                      value={o.title}
                      required={i !== options.length - 1}
                      onFocus={() => handleOptionFocus(i)}
                      onChange={(e) => handleOptionChange(e, i)}
                      className="border border-gray-300 rounded h-12 px-4 text-black"
                    />
                    <button
                      className="text-gray-300"
                      type="button"
                      onClick={() => removeOption(i)}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="my-6">
            <button
              className="bg-orange-600 text-white rounded px-4 h-10"
              disabled={createMutation.isLoading}
            >
              Create Poll
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePoll;
