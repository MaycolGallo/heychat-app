import { MessageSquarePlus, ListFilter, Search } from "lucide-react";
import { Input } from "../ui/input";
import { FriendList } from "./friend-list";
import { Suspense } from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { getFriendList } from "@/lib/getFriendList";

export  async function UserListChat() {
  const session = await getServerSession(authOptions);
  const friends = await getFriendList(session?.user?.id!);
  return (
    <nav className="max-w-sm  flex-1 border-r border-neutral-300 h-screen ">
      <section className="flex sticky top-0 z-10  flex-col bg-white justify-between px-4 pt-4">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl">Chats</h1>
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

      {/* <Suspense fallback={<div>Loading...</div>}>
        <FriendList sessionId={session?.user?.id!} friends={friends}/>
      </Suspense> */}
      <FriendList sessionId={session?.user?.id!} friends={friends}/>

    </nav>
  );
}
