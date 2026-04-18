import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      isTwoFactorVerified?: boolean;
    } & DefaultSession["user"]
  }
}