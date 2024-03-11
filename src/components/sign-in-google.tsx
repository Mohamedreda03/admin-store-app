"use client";

import { getSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function SignInGoogle() {
  useEffect(() => {
    haga();
  }, []);
  const haga = async () => {
    const user = await getSession();
    console.log(user);
  };
  return (
    <div className="flex p-5 ">
      <button
        onClick={() => signIn("google")}
        type="button"
        className="bg-white text-black py-2 px-4 rounded"
      >
        google
      </button>
    </div>
  );
}
