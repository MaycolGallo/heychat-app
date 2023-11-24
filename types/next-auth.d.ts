type userId = string;

import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: User & {
      id: userId;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: userId;
  }
}