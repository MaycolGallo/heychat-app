"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

type SessionProps = {
  children: React.ReactNode;
  session: Session | null;
};

export function Provider({ children, session }: SessionProps) {
  
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
