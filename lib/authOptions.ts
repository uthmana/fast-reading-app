import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getInputTypeValue } from "@/utils/helpers";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any): Promise<any | null> {
        const { name, password } = credentials;
        if (!name || !password) return null;

        try {
          const where: any = getInputTypeValue(name);
          if (!where) return null;

          const user = await prisma.user.findUnique({
            where,
            include: {
              Student: true,
            },
          });

          if (!user) return null;
          //const isValid = await bcrypt.compare(password, user.password);
          if (password !== user.password) return null;

          if (user?.active === false) {
            throw new Error("User subscription has expired");
          }

          if (user?.Student?.endDate) {
            const now = new Date();
            const endDate = new Date(user.Student.endDate);
            if (endDate < now) {
              throw new Error("Student subscription has expired");
            }
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role as Role,
            name: user.name ?? "",
            username: user.username ?? "",
            student: user.Student ?? null,
          };
        } catch (error) {
          console.error(error);
          return error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.id = user.id;
        token.student = user.student ?? null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.username = token.username as string;
        session.user.id = token.id as string;
        session.user.student = token.student ?? null;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
