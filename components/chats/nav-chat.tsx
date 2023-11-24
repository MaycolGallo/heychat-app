"use client";

import { ListFilter, MessageSquarePlus, Search } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { Input } from "../ui/input";
import { useViewportSize } from "@/lib/useViewport";
import { Skeleton } from "../ui/skeleton";

export function NavChat({ children }: { children: React.ReactNode }) {
  const isChatRoute = usePathname() === '/chats';
  const { width } = useViewportSize();
  
  if (width === 0) {
    return (
      <Skeleton className="h-full w-full" />
    )
  }
  
  return (
    <nav className={`md:max-w-sm ${!isChatRoute && width < 768 ? "hidden" : "w-full"} flex-1 border-r border-neutral-300 `}>
      <section className="flex sticky top-0 z-10  flex-col bg-white justify-between px-4 pt-4">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl text-neutral-700">Chats </h1>
          <div className="flex gap-4">
            <p>
              <MessageSquarePlus className="h-5 w-5" />
            </p>
            <p>
              <ListFilter className="h-5 w-5" />
            </p>
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
