import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name: string;
      username: string;
      student: any;
      subscriberId?: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    name?: string;
    username?: string;
    student?: any;
    subscriberId?: number;
  }
}
