"use client";

import { ListFilter, MessageSquarePlus, MessageSquarePlusIcon, Search, UserPlus } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { Input } from "../ui/input";
import { useViewportSize } from "@/lib/useViewport";
import { Skeleton } from "../ui/skeleton";
import { AddUser } from "../AddUser";
import { Button } from "../ui/button";

export function NavChatSkeleton() {
  return (
    <>
      {[1, 2, 3,4].map((i) => (
        <Skeleton key={i} className="h-36 w-full rounded-lg" />
      ))}
    </>
  );
}

export function NavChat({ children }: { children: React.ReactNode }) {
  const isChatRoute = usePathname() === "/chats";
  const { width } = useViewportSize();

  if (width === 0 && isChatRoute) {
    return (
      <div className="h-full w-full md:w-96 bg-white flex p-5 flex-col gap-3">
        <NavChatSkeleton />
      </div>
    );
  } else if (width === 0 && !isChatRoute) {
    return (
      <div className="h-full hidden md:w-96 bg-white p-5 md:flex flex-col gap-3">
        <NavChatSkeleton />
      </div>
    );
  }

  return (
    <nav
      className={`md:max-w-sm ${
        !isChatRoute && width < 768 ? "hidden" : "w-full"
      } flex-1 border-r border-neutral-300 `}
    >
      <section className="flex border-t-2 border-neutral-300 sticky top-0 z-10  flex-col bg-white justify-between px-4 pt-4">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl text-neutral-700">Chats </h1>
          <div className="flex gap-4">
            <AddUser>
              <Button className="hover:bg-neutral-200 px-4 py-2 bg-white text-blue-950 transition-all">
                <MessageSquarePlusIcon className="w-5 h-5" />
              </Button>
            </AddUser>
            {/* <p> 
              <ListFilter className="h-5 w-5" />
            </p> */}
          </div>
        </div>
        <section className="my-4 relative">
          <Input
            className="rounded-xl bg-neutral-200 pl-8"
            placeholder="Buscar"
          />
          <Search className="absolute w-5 h-5 left-2 top-2" />
        </section>
      </section>
      {children}
    </nav>
  );
}
