"use client";

import { getFriendList } from "@/lib/getFriendList";
import { Await } from "../buildui/await";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { linkChatSorted, toPusherKey } from "@/lib/utils";
import { useEffect, Suspense } from "react";
import { pusherClient } from "@/lib/pusher";
import { toast } from "../ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";

export function FriendList({
  sessionId,
  friends,
}: {
  sessionId: string;
  friends: User[];
}) {
  const pathname = usePathname();

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));
    pusherClient.bind("new-friend", (message: ExtendedMessage) => {
      const isNotChatPage =
        pathname !== `/chats/${linkChatSorted(sessionId, message.senderId)}`;

      if (!isNotChatPage) return;

      toast({
        title: message.senderName,
        description: <p className="text-sm truncate">{message.text}</p>,
      });
    });
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
    };
  }, [sessionId, pathname]);

  return (
    <ul className=" flex flex-col gap-4 p-4">
      {friends.sort().map((friend) => (
        <li
          className="flex items-center justify-between border gap-3 border-neutral-300 rounded-lg p-4 shadow"
          key={friend.id}
        >
          <Link href={`/chats/${linkChatSorted(sessionId, friend.id)}`}>
            {friend.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
