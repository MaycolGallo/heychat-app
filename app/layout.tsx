import { Provider } from "@/SessionProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { getServerSession } from "next-auth";
import { Toaster } from "@/components/ui/toaster"
import { GET, authOptions } from "./api/auth/[...nextauth]/route";

const font = Onest({ display: "swap", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HeyChat!",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
  chats,
  landing,
}: {
  children: React.ReactNode;
  chats: React.ReactNode;
  landing: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="64x64" />
      </head>
      <body className={font.className}>
        <Provider session={session}>{children}</Provider>
        <Toaster />
      </body>
    </html>
  );
}
