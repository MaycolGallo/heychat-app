import { linkChatSorted } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
  friend: User;
  unseenCount: number;
  friendLastMessage: any[];
  sessionId: string;
};

const useLastMessage = (friendLastMessage: any[], friendId: string) => {
  return useMemo(() => {
    return friendLastMessage?.find((msg) => msg.id === friendId);
  }, [friendLastMessage, friendId]);
};

export function FriendItem({
  friend,
  unseenCount,
  friendLastMessage,
  sessionId,
}: Props) {
  const getLastMessage = useLastMessage(friendLastMessage, friend.id);

  return (
    <li className="flex items-center justify-between border gap-3 border-neutral-300 dark:border-neutral-700 rounded-lg p-4 shadow">
      <Link
        href={`/chats/${linkChatSorted(sessionId, friend.id)}`}
        className="flex gap-3 w-full"
      >
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
            <p className="text-sm max-w-[200px] truncate text-neutral-700 dark:text-neutral-400">
              {getLastMessage.lastMessage.text}
            </p>
          )}
        </div>
        {getLastMessage?.lastMessage && (
          <div className="flex flex-col items-center justify-between">
            <span className="text-sm">
              {new Date(getLastMessage.lastMessage.timestamp).toLocaleString(
                "es-pe",
                {
                  month: "short",
                  day: "numeric",
                  // year: '2-digit',
                }
              )}
            </span>
            {unseenCount > 0 && (
              <span className="w-5 h-5 animate-in zoom-in-0 duration-300 rounded-full text-xs flex items-center justify-center bg-blue-950 dark:bg-blue-600 text-white">
                {unseenCount}
              </span>
            )}
          </div>
        )}
      </Link>
    </li>
  );
}
