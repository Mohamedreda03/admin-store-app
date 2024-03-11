import { NextResponse } from "next/server";
import prisma from "../../../../../lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return new NextResponse("username, email and password is required.", {
      status: 400,
    });
  }

  const oldUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (oldUser) {
    return new NextResponse("email already exists.", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: username,
      email,
      password: hashedPassword,
    },
  });
  return NextResponse.json(newUser, { status: 201 });
}
