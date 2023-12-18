import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFriendList } from "@/lib/getFriendList";
import { ListContacts } from "./components/list-contacts";
import { Suspense } from "react";
import { ListBlocked } from "./components/list-block";

export default async function Page() {
  const session = await getServerSession(authOptions);

  const [numContacts, friends] = await Promise.all([
    db.scard(`user:${session?.user?.id}:friends`),
    getFriendList(session?.user?.id!)
  ]);

  const contacts = await Promise.all(
    friends.map(async (friend) => {
      const contact = (await db.json.get(`user:${session?.user.id}:friends_info`,'$.friends[*]')) as Friend[];
      const matchingContact = contact.find((contact) => contact.id === friend.id);
      return {
        ...friend,
        blocked: matchingContact?.blocked,
        added: matchingContact?.added,
      }
    })
  )

  console.log(contacts)

  return (
    <div className="p-6 w-full lg:w-[calc(100%-384px)] bg-sky-50 dark:bg-zinc-900">
     <div className="space-y-3">
     <h1 className="text-3xl font-bold text-blue-950 dark:text-blue-50">Tus Contactos</h1>
      <p>Tienes {numContacts} contacto(s)</p>
     </div>
      <Tabs defaultValue="account" className="w-full my-4">
        <TabsList>
          <TabsTrigger value="account">Todos</TabsTrigger>
          <TabsTrigger value="password">Bloqueados</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <ListContacts initialContacts={contacts} />
        </TabsContent>
        <TabsContent value="password">
          <Suspense fallback={<div>Loading...</div>}>
            <ListBlocked initialContacts={contacts} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
