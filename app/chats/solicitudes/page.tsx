import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import ListRequests from "./components/list-requests";

export default async function FriendRequests() {
  const session = await getServerSession(authOptions);

  const incomingIds = await db.smembers(
    `user:${session?.user?.id}:incoming_friend_requests`
  );
  const incomings = await Promise.all(
    incomingIds.map(async (id) => {
      const user = (await db.get(`user:${id}`)) as User;
      return {
        senderId: id,
        senderName: user.name,
        senderEmail: user.email,
        senderImage: user.image,
      };
    })
  );

  return (
    <div className="p-6 w-full bg-sky-50 dark:bg-neutral-900 lg:w-[calc(100%-384px)]">
      <h1 className="text-3xl font-bold text-blue-950 dark:text-blue-50">
        Solicitudes de mensaje
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ListRequests
          initialRequests={incomings}
          sessionId={session?.user.id!}
        />
      </Suspense>
    </div>
  );
}
