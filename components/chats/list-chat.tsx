import { MessageSquarePlus, ListFilter, Search } from "lucide-react";
import { FriendList } from "./friend-list";
import { Suspense } from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getFriendList } from "@/lib/getFriendList";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { NavChat } from "./nav-chat";
import { db } from "@/lib/db";
import { linkChatSorted } from "@/lib/utils";
import { cache } from "react";

const listLastMessages = cache(async (friends: User[], session: any) => {
  const friendLastMessages = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessage] = (await db.zrange(
        `chat:${linkChatSorted(session?.user?.id!, friend.id)}:messages`,
        -1,
        -1
      )) as Message[];
      return {
        ...friend,
        lastMessage,
        chatId: linkChatSorted(session?.user?.id!, friend.id),
      };
    })
  );
  return friendLastMessages;
})

export async function UserListChat() {
  const session = await getServerSession(authOptions);
  const friends = await getFriendList(session?.user?.id!);

  const friendLastMessages = await listLastMessages(friends, session);

  return (
    <NavChat>
      <ScrollArea className="list-chat-height dark:bg-neutral-900">
        <Suspense fallback={<Skeleton className="h-16" />}>
          <FriendList sessionId={session?.user?.id!} friendLastMessage={friendLastMessages} friends={friends} />
          <ScrollBar orientation="vertical" />
        </Suspense>
      </ScrollArea>
    </NavChat>
  );
}
