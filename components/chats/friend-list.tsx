"use client";

import { getFriendList } from "@/lib/getFriendList";
import { Await } from "../buildui/await";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { linkChatSorted, toPusherKey } from "@/lib/utils";
import React, { useEffect, Suspense, useState, memo, useMemo } from "react";
import { pusherClient } from "@/lib/pusher";
// import { useToast } from "../ui/use-toast";
import {toast} from 'sonner'
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { AddUser } from "../AddUser";
import { FriendItem } from "./friend-item";
import usePartySocket from "partysocket/react";
import { CheckCircle2 } from "lucide-react";

export const FriendList = memo(function FriendList({
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
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeFriends, setActiveFriends] = useState<User[]>(friends);
  const [lastMessages, setLastMessages] = useState<any[]>(
    friendLastMessage || []
  );

  const uniqueFriends = useMemo(
    () => [
      ...new Map(activeFriends.map((friend) => [friend.id, friend])).values(),
    ],
    [activeFriends]
  );

  console.log("last messages", lastMessages);

  usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: "friends",
    onMessage(event) {
      const message = JSON.parse(event.data);
      console.log("yeah the sky is full of love", message);
      console.log("is bith nige", sessionId);
      if (message.type === "new_message") {
        setLastMessages((prev) =>
          prev.map((mess) => {
            if (
              mess.lastMessage &&
              mess.lastMessage.senderId === message.message.senderId &&
              mess.chatId === message.chatId
            ) {
              return {
                ...mess,
                lastMessage: message.message,
              };
            }
            return mess;
          })
        );
      } else if (
        message.type === "new_message" &&
        message.userId !== sessionId
      ) {
        setUnseenMessages((prev) => [...prev, message.message]);
      }
    },
  });

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend: User) => {
      setActiveFriends((prev) => [...prev, newFriend]);
    };

    // const handleIncomingMessage = (message: ExtendedMessage) => {
    //   setLastMessages((prev) => [...prev, message]);

    const newMessageHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !== `/chats/${linkChatSorted(sessionId, message.senderId)}`;
      if (!shouldNotify) return;

      setUnseenMessages((prev) => [...prev, message]);

      // toast({
      //   title: (
      //     <h1 className="text-lg font-semibold">{message.senderName}</h1>
      //   ) as any,
      //   description: <p className="text-sm truncate">{message.text}</p>,
      // });
    };

    pusherClient.bind("new_message", newMessageHandler);
    pusherClient.bind("new_friend", newFriendHandler);
    // pusherClient.bind("incoming_message", handleIncomingMessage);
    // pusherClient.bind("message_removed", handleRemovedMessage);
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind("new_message", newMessageHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
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
      {uniqueFriends.length ? (
        <ul className=" flex flex-col gap-4 p-4">
          
          {uniqueFriends.sort().map((friend) => {
            const unseenCount = unseenMessages.filter(
              (msg) => msg.senderId === friend.id
            ).length;

            return (
              <FriendItem
                friend={friend}
                key={friend.id}
                friendLastMessage={friendLastMessage!}
                sessionId={sessionId}
                // unseenCount={unseenMessages.length}
                unseenCount={unseenCount}
              />
            );
          })}
        </ul>
      ) : (
        <EmptyList />
      )}
    </>
  );
});

export function EmptyList() {
  return (
    <div className="absolute flex flex-col items-center gap-3 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      <Image
        src={"https://img.icons8.com/?size=256&id=15940&format=png"}
        alt="logo"
        className="dark:invert"
        width={100}
        height={100}
      />
      <h4 className="font-semibold">Sin Contactos</h4>
      <AddUser />
    </div>
  );
}
