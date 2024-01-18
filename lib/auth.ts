import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { cache } from "react";

const getUser = cache(async (id: string) => {
  const user = (await db.get(`user:${id}`)) as User | null;
  return user;
})

export const authOptions = {
  adapter: UpstashRedisAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    /**
     * Retrieves the user data from the database using the provided token ID.
     * If the user is not found in the database, the token ID is replaced with
     * the user ID and returned.
     */
    async jwt(params) {
      const dbUser = await getUser(params.token.id);

      if (!dbUser) {
        params.token.id = params.user.id;
        return params.token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      return "/chats";
    },
  },
} satisfies NextAuthOptions;
