import { MessageSquarePlus, ListFilter, Search } from "lucide-react";
import { Input } from "../ui/input";
import { FriendList } from "./friend-list";
import { Suspense } from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getFriendList } from "@/lib/getFriendList";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { NavChat } from "./nav-chat";

export async function UserListChat() {
  const session = await getServerSession(authOptions);
  const friends = await getFriendList(session?.user?.id!);
  return (
    <NavChat>
      <ScrollArea className="list-chat-height">
        <Suspense fallback={<Skeleton className="h-16" />}>
          <FriendList sessionId={session?.user?.id!} friends={friends} />
          <ScrollBar orientation="vertical" />
        </Suspense>
      </ScrollArea>
    </NavChat>
  );
}
