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
import Image from "next/image";
import { AddUser } from "../AddUser";

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
      const isChatPage =
        pathname !== `/chats/${linkChatSorted(sessionId, message.senderId)}`;

      if (!isChatPage) return;

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
    <>
      {friends.length ? (
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
      ) : (
        <EmptyList />
      )}
    </>
  );
}

export function EmptyList() {
  return (
    <div className="absolute flex flex-col items-center gap-3 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      <Image
        src={"https://img.icons8.com/?size=256&id=15940&format=png"}
        alt="logo"
        width={100}
        height={100}
      />
      <h4 className="font-semibold">Sin Contactos</h4>
      <AddUser />
    </div>
  );
}
