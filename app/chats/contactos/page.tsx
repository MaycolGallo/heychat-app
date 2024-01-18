import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFriendList } from "@/lib/getFriendList";
import { ListContacts } from "./components/list-contacts";
import { Suspense } from "react";
import { ListBlocked } from "./components/list-block";
import { cache } from "react";
import { getDistinctCategories } from "@/lib/getFilters";
import { Filters } from "./components/filters";
import { unstable_noStore } from "next/cache";

const getContacts = cache(async (friends: User[], session: any) => {
  const contacts = await Promise.all(
    friends.map(async (friend) => {
      const contact = (await db.json.get(
        `user:${session?.user.id}:friends_info`,
        "$.friends[*]"
      )) as Friend[];
      const matchingContact = contact.find(
        (contact) => contact.id === friend.id
      );
      return {
        ...friend,
        blocked: matchingContact?.blocked,
        added: matchingContact?.added,
        category: matchingContact?.category,
      };
    })
  );
  return contacts;
});

export default async function Page() {
  unstable_noStore();
  const session = await getServerSession(authOptions);

  const [numContacts, friends] = await Promise.all([
    db.scard(`user:${session?.user?.id}:friends`),
    getFriendList(session?.user?.id!),
  ]);

  const contacts = await getContacts(friends, session);
  // const filters = 

  return (
    <div className="p-6 w-full lg:w-[calc(100%-384px)] bg-sky-50 dark:bg-zinc-900">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-blue-950 dark:text-blue-50">
          Tus Contactos
        </h1>
        <p>Tienes {numContacts} contacto(s)</p>
      </div>
      <Tabs defaultValue="account" className="w-full my-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="account">Todos</TabsTrigger>
            <TabsTrigger value="password">Bloqueados</TabsTrigger>
          </TabsList>
          {/* <Filters filters={filters} /> */}
        </div>
        <TabsContent className="relative" value="account">
          <ListContacts
            // @ts-ignore
            initialContacts={contacts}
            sessionId={session?.user.id}
          />
        </TabsContent>
        <TabsContent value="password">
          <Suspense fallback={<div>Loading...</div>}>
            <ListBlocked
              initialContacts={contacts}
              sessionId={session?.user.id}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
