"use client";

import { getFriendList } from "@/lib/getFriendList";
import { Await } from "../buildui/await";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { linkChatSorted, toPusherKey } from "@/lib/utils";
import React, {
  useEffect,
  Suspense,
  useState,
  memo,
  useMemo,
  useCallback,
} from "react";
import { pusherClient } from "@/lib/pusher";
// import { useToast } from "../ui/use-toast";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { AddUser } from "../AddUser";
import { FriendItem } from "./friend-item";
import usePartySocket from "partysocket/react";
import { extractString } from "@/lib/extractString";

type Unseen = Record<string, { unseen: number }>;

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
  const query = useParams();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeFriends, setActiveFriends] = useState<User[]>(friends);
  const [unseenMes, setUnseenMess] = useState<Unseen>({});
  const [lastMessages, setLastMessages] = useState<any[]>(
    friendLastMessage || []
  );

  const uniqueFriends = useMemo(
    () => [
      ...new Map(activeFriends.map((friend) => [friend.id, friend])).values(),
    ],
    [activeFriends]
  );

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: sessionId,
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "new_message" && message.userId !== sessionId) {
        setUnseenMessages((prev) => {
          return [...prev, message];
        });
      }

      if (message.unseen !== undefined) {
        setUnseenMess(message.unseen);
      }
    },
  });

  const getUnseenCount = useCallback(
    (friendId: string) => {
      const unseenCount = unseenMes[friendId]?.unseen || 0;
      return unseenCount;
    },
    [unseenMes]
  );

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
    setUnseenMess((prev) => {
      if (query.chatId) {
        const friendId = extractString(query.chatId as string, sessionId);
        if (friendId === undefined) return prev; // Return previous state if friendId is undefined
        socket.send(JSON.stringify({ type: "seen", id: friendId }));
        return {
          ...prev,
          [friendId]: { unseen: 0 },
        };
      }
      return prev;
    });
  }, [socket, sessionId, query.chatId]);

  return (
    <>
      {uniqueFriends.length ? (
        <ul className=" flex flex-col gap-4 p-4">
          {uniqueFriends.sort().map((friend) => {
            return (
              <FriendItem
                friend={friend}
                key={friend.id}
                friendLastMessage={friendLastMessage!}
                sessionId={sessionId}
                unseenCount={getUnseenCount(friend.id)}
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
