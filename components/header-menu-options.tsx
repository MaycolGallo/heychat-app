import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { ListOptionsHeader } from "./list-options-header";

export async function ChatOptions() {
  const session = await getServerSession(authOptions);
  const unseen = (
    await db.smembers(`user:${session?.user?.id}:incoming_friend_requests`)
  ).length;

  return (
    <section className="flex items-center gap-4">
      <ListOptionsHeader
        initialUnseen={unseen}
        sessionId={session?.user?.id!}
      />
    </section>
  );
}
