import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { UserPlus2, Bell } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const options = [
  {
    label: "Solicitudes mensajes",
    link: "/chats/solicitudes",
    icon: <UserPlus2 className="h-5 w-5" />,
  },
  {
    label: "Notificaciones",
    link: "/notificaciones",
    icon: <Bell className="h-5 w-5" />,
  },
];

export async function ChatOptions() {
  const session = await getServerSession(authOptions);
  const unseen = (
    await db.smembers(`user:${session?.user?.id}:incoming_friend_requests`)
  ).length;
  return (
    <section className="flex items-center gap-4">
      <TooltipProvider>
        {options.map((option) => (
          <Tooltip key={option.label}>
            <TooltipTrigger asChild>
              <Link
                className="rounded-full relative bg-neutral-300 p-3"
                href={option.link}
              >
                <TooltipContent>{option.label}</TooltipContent>
                {option.icon}
                {unseen > 0 && option.label === "Solicitudes mensajes" && (
                  <span className="absolute top-0 text-sm right-0 h-4 flex items-center justify-center text-white p-3 w-4 rounded-full bg-purple-500">
                    {unseen}
                  </span>
                )}
              </Link>
            </TooltipTrigger>
          </Tooltip>
        ))}
      </TooltipProvider>
    </section>
  );
}
