import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma/prisma";
import GitHub from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    user: {
      type: string;
    } & DefaultSession["user"];
  }
}

interface User extends NextAuthUser {
  type: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google, GitHub],
  pages: { signIn: "/signin" },
  session: { strategy: "jwt" },
});
