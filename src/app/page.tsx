import SignInGoogle from "@/components/sign-in-google";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "ADMIN") {
    return (
      <div>
        <h1>ADMIN PAGE</h1>
      </div>
    );
  } else if (session?.user.role === "MANAGE") {
    return (
      <div>
        <h1>MANAGE PAGE</h1>
      </div>
    );
  }
  return (
    <div>
      <h1>USER PAGE</h1>
    </div>
  );
}
