"use client";
import { Bell, UserPlus2 } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

const options = [
  {
    label: "Solicitudes mensajes",
    link: "/chats/solicitudes",
    icon: <UserPlus2 className="h-5 w-5" />,
  },
  // {
  //   label: "Notificaciones",
  //   link: "/notificaciones",
  //   icon: <Bell className="h-5 w-5" />,
  // },
];

type ListOptionsHeaderProps = {
  initialUnseen: number;
  sessionId: string;
};

export function ListOptionsHeader({
  initialUnseen,
  sessionId,
}: ListOptionsHeaderProps) {
  const [unseen, setUnseen] = useState(initialUnseen);
  const router = useRouter();

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = () => {
      setUnseen((prev) => prev - 1);
    };
    const newFriendRequestHandler = () => {
      setUnseen((prev) => prev + 1);
    };

    pusherClient.bind("new_incoming_friend", newFriendRequestHandler);
    pusherClient.bind("new_friend", newFriendHandler);
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind("new_friend", newFriendHandler);
      pusherClient.unbind("new_incoming_friend", newFriendRequestHandler);
    };
  }, [sessionId,router]);

  return (
    <TooltipProvider>
      {options.map((option) => (
        <Tooltip key={option.label}>
          <TooltipTrigger asChild>
            <Link
              className="rounded-full hover:ring-2 ring-offset-2 focus:ring-blue-500 hover:ring-blue-500 relative bg-neutral-300 p-3"
              href={option.link}
            >
              {option.icon}
              {unseen > 0 && option.label === "Solicitudes mensajes" && (
                <span className="absolute left-7 text-sm bottom-7 h-4 flex items-center justify-center text-white p-3 w-4 rounded-full bg-blue-500">
                  {unseen}
                </span>
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent>{option.label}</TooltipContent>
        </Tooltip>
      ))}
    </TooltipProvider>
  );
}
