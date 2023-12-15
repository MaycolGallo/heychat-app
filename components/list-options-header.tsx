"use client";
import { Bell, UserPlus2,Contact2 } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { cn, toPusherKey } from "@/lib/utils";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { usePathname, useRouter } from "next/navigation";

function IconContacts() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M6 8a3 3 0 100-6 3 3 0 000 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h4a.5.5 0 000-1h-4zm2 3a.5.5 0 000 1h2a.5.5 0 000-1h-2zm0 3a.5.5 0 000 1h2a.5.5 0 000-1h-2z"></path>
    </svg>
  );
}

const options = [
  {
    label: "Contactos",
    link: "/chats/contactos",
    icon: <IconContacts />,
  },
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
  const pathname = usePathname();

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const addedFriendHandler = () => {
      setUnseen((prev) => prev - 1);
    };
    const newFriendRequestHandler = () => {
      setUnseen((prev) => prev + 1);
    };

    pusherClient.bind("new_incoming_friend", newFriendRequestHandler);
    pusherClient.bind("new_friend", addedFriendHandler);
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind("new_friend", addedFriendHandler);
      pusherClient.unbind("new_incoming_friend", newFriendRequestHandler);
    };
  }, [sessionId]);

  return (
    <TooltipProvider>
      {options.map((option) => (
        <Tooltip key={option.label}>
          <TooltipTrigger asChild>
            <Link
              className={cn(
                "rounded-full dark:bg-neutral-700 dark:text-nueutral-100 hover:ring-2 ring-offset-2 dark:ring-offset-neutral-800 focus:ring-blue-500 hover:ring-blue-500 relative bg-neutral-300 p-3",
                pathname === option.link && "dark:bg-blue-300 dark:text-blue-950 text-blue-950 bg-blue-300"
              )}
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
