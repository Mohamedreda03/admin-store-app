"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

type InputData = {
  isValid: boolean;
  value: string;
};

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<InputData>({
    isValid: true,
    value: "",
  });
  const [email, setEmail] = useState<InputData>({
    isValid: true,
    value: "",
  });
  const [password, setPassword] = useState<InputData>({
    isValid: true,
    value: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

    if (!passwordRegex.test(password.value)) {
      setPassword((e) => {
        return {
          value: e.value,
          isValid: false,
        };
      });
    }

    if (username.value.length <= 3) {
      setUsername((e) => {
        return {
          value: e.value,
          isValid: false,
        };
      });
    }
    if (!username.isValid || !email.isValid || !password.isValid) {
      console.log("error");

      return null;
    }
    try {
      await signIn("credentials", {
        email: email.value,
        password: password.value,
        redirect: false,
      });
      toast.success("sign up successfully.");
      router.push("/");
      setIsLoading(false);
    } catch (error) {
      toast.error("something wont wrong.");
    }
  };
  return (
    <div>
      <div className="flex justify-center pt-16">
        <div className="max-w-lg w-full sm:border rounded-md p-10">
          <h2 className="block text-center font-bold text-3xl mb-10">
            Sign In
          </h2>
          <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="username" className="text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  disabled={isLoading}
                  placeholder="example@gmail.com"
                  onChange={(e) =>
                    setEmail({ isValid: true, value: e.target.value })
                  }
                  className="focus:outline-none border rounded-md px-4 py-2.5"
                />
                {email.isValid === false && (
                  <p className="text-[14px] text-red-600">
                    Enter a valid email address without spaces. Example:
                    user@example.com
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="username" className="text-slate-700">
                  Password
                </label>
                <input
                  type="text"
                  disabled={isLoading}
                  placeholder="password"
                  onChange={(e) =>
                    setPassword({ isValid: true, value: e.target.value })
                  }
                  className="focus:outline-none border rounded-md px-4 py-2.5"
                />
                {password.isValid === false && (
                  <p className="text-[14px] text-red-600">
                    Password must be 8-16 characters, with at least one digit,
                    one lowercase letter, one uppercase letter.
                  </p>
                )}
              </div>
              <div className="flex">
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full p-6 text-md"
                >
                  {isLoading && (
                    <span>
                      <LoaderCircle className="animate-spin mr-2" size={20} />
                    </span>
                  )}
                  Sign In
                </Button>
              </div>
            </form>
            <div className="text-md text-black/70 mt-2">
              create an account
              <Link href="/sign-up" className="underline text-black/85 ml-1">
                Sign up
              </Link>
            </div>
            <div className="flex mt-4">
              <Button
                onClick={() => signIn("google")}
                disabled={isLoading}
                variant="outline"
                className="flex w-full gap-2 p-6 text-md"
              >
                <span>
                  <Image
                    src="./google.svg"
                    height={30}
                    width={30}
                    alt="google image"
                  />
                </span>
                Sign in with google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
