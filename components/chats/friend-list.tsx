"use client";

import { getFriendList } from "@/lib/getFriendList";
import { Await } from "../buildui/await";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { linkChatSorted, toPusherKey } from "@/lib/utils";
import { useEffect, Suspense, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { useToast } from "../ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { AddUser } from "../AddUser";
import { friendLastMessage } from "@/lib/lastMessage";
import { revalidatePath } from "next/cache";

export function FriendList({
  sessionId,
  friends,
  friendLastMessage,
}: {
  sessionId: string;
  friends: User[];
  friendLastMessage?: any[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeFriends, setActiveFriends] = useState<User[]>(friends);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend: User) => {
      setActiveFriends((prev) => [...prev, newFriend]);
    
    }

    const newMessageHandler = (message: ExtendedMessage) => {
      const isChatPage =
        pathname !== `/chats/${linkChatSorted(sessionId, message.senderId)}`;
      console.log(isChatPage);
      console.log(message);

      if (!isChatPage) return;

      setUnseenMessages((prev) => [...prev, message]);

      toast({
        title: message.senderName,
        description: <p className="text-sm truncate">{message.text}</p>,
      });
    };

    pusherClient.bind("new_message", newMessageHandler);
    pusherClient.bind('new_friend', newFriendHandler);
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind("new_message", newMessageHandler);
      pusherClient.unbind('new_friend', newFriendHandler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, pathname, router]);

  useEffect(() => {
    if (pathname.includes("/chats")) {
      setUnseenMessages((prev) =>
        prev.filter((msg) => !pathname.includes(msg.senderId))
      );
    }
  }, [pathname]);

  return (
    <>
      {friends.length ? (
        <ul className=" flex flex-col gap-4 p-4">
          {activeFriends.sort().map((friend) => {
            const unseenCount = unseenMessages.filter(
              (msg) => msg.senderId === friend.id
            ).length;
            const getLastMessage = friendLastMessage?.find(
              (msg) => msg.id === friend.id
            )
            
            return (
              <li
                className="flex items-center justify-between border gap-3 border-neutral-300 rounded-lg p-4 shadow"
                key={friend.id}
              >
                <Link href={`/chats/${linkChatSorted(sessionId, friend.id)}`} className="flex gap-3 w-full">
                  <span className="flex items-start">
                    <Image
                      src={friend.image}
                      width={40}
                      height={40}
                      className="rounded-full shrink-0"
                      alt={`${friend.name} profile pic`}
                    />
                  </span>
                  <div className="flex flex-1 flex-col justify-center">
                    <h1 className="font-semibold">{friend.name}</h1>
                    {getLastMessage?.lastMessage && (
                      <p className="text-sm max-w-[200px] truncate text-neutral-700">
                        {getLastMessage.lastMessage.text}
                      </p>
                    )}
                  </div>
                  {getLastMessage?.lastMessage && (
                    <div className="flex flex-col items-center justify-between">
                      <span className="text-sm">
                        {new Date(getLastMessage.lastMessage.timestamp).toLocaleString('es-pe',{
                          month: 'short',
                          day: 'numeric',
                          // year: '2-digit',
                        })}
                      </span>
                      {unseenCount > 0 && (
                        <span className="w-5 h-5 rounded-full text-sm bg-blue-950 text-white">
                          {unseenCount}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
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
