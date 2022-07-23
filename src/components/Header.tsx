import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800">
      <div
        className="text-2xl font-bold"
        style={{
          background: "linear-gradient(-70deg, #faeea2 0%, #ff6464 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        updoot
      </div>
      <div className="ml-4">
        <LoginButton />
      </div>
    </div>
  );
}

function LoginButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex gap-2 items-center">
        {session.user.image ? (
          <div className="border-2 border-white rounded-full leading-[0px]">
            <Image
              src={session.user.image}
              alt=""
              height={32}
              width={32}
              className="rounded-full"
            />
          </div>
        ) : (
          <span>Signed in as {session.user.email}</span>
        )}

        <button
          onClick={() => signOut()}
          className="h-8 inline-flex items-center bg-orange-600 text-white rounded px-4 text-sm"
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div>
      <button
        onClick={() => signIn()}
        className="h-8 inline-flex items-center bg-orange-600 text-white rounded px-4 text-sm"
      >
        Sign in
      </button>
    </div>
  );
}
