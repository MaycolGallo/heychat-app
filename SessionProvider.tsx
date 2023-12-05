"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

type SessionProps = {
  children: React.ReactNode;
  session: Session | null;
};

export function Provider({ children, session }: SessionProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider enableSystem={true} attribute="class">
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
