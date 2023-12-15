"use client";

import { ListFilter, MessageSquarePlus, MessageSquarePlusIcon, Search, UserPlus } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { Input } from "../ui/input";
import { useViewportSize } from "@/lib/useViewport";
import { Skeleton } from "../ui/skeleton";
import { AddUser } from "../AddUser";
import { Button } from "../ui/button";
import { SearchUsers } from "../ui/search/search-users";
import { SearchResults } from "../ui/search/search-results";

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
      <div className="h-full w-full md:w-96 bg-white dark:bg-neutral-900 flex p-5 flex-col gap-3">
        <NavChatSkeleton />
      </div>
    );
  } else if (width === 0 && !isChatRoute) {
    return (
      <div className="h-full hidden md:w-96 bg-white dark:bg-neutral-900 p-5 md:flex flex-col gap-3">
        <NavChatSkeleton />
      </div>
    );
  }

  return (
    <nav
      className={`md:max-w-sm ${
        !isChatRoute && width < 768 ? "hidden" : "w-full"
      } flex-grow border-r border-neutral-300 dark:border-neutral-800`}
    >
      <section className="flex border-t-2 border-neutral-300 dark:border-neutral-800 sticky top-0 z-10  flex-col bg-white dark:bg-neutral-900 justify-between px-4 pt-4">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl text-neutral-700 dark:text-neutral-100">Chats </h1>
          <div className="flex gap-4">
            <AddUser>
              <Button className="hover:bg-neutral-200 dark:text-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 px-4 py-2 bg-white text-blue-950 transition-all">
                <MessageSquarePlusIcon className="w-5 h-5" />
              </Button>
            </AddUser>
            {/* <p> 
              <ListFilter className="h-5 w-5" />
            </p> */}
          </div>
        </div>
        <section className="my-4 relative">
          {/* <SearchResults /> */}
          <SearchUsers />
          
        </section>
      </section>
      {children}
    </nav>
  );
}
