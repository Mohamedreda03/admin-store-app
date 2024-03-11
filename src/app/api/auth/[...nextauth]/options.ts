import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthOptions, AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

import prisma from "../../../../../lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const dbUser = await prisma.user.findFirst({
          where: {
            email: credentials?.email,
          },
        });

        if (!dbUser) {
          return null;
        }

        const isCompare = bcrypt.compare(
          credentials?.password,
          dbUser.password!
        );

        if (!isCompare) {
          return null;
        }

        return dbUser;
      },
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user?.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        role: dbUser.role,
        emailVerified: dbUser.emailVerified,
        password: dbUser.password,
      };
    },
  },

  pages: {
    signIn: "/sign-up",
  },
  session: {
    strategy: "jwt",
  },
} satisfies AuthOptions;
