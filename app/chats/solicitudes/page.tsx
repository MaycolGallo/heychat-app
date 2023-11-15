import { db } from "@/lib/db";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AcceptButton } from "@/app/chats/solicitudes/components/accept-btn";

export default async function FriendRequests() {
  const session = await getServerSession(authOptions);

  const incomingIds = await db.smembers(
    `user:${session?.user?.id}:incoming_friend_requests`
  );
  const incomings = await Promise.all(
    incomingIds.map(async (id) => {
      const user = (await db.get(`user:${id}`)) as User;
      return {
        id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    })
  );

  return (
    <div className="p-4 w-[calc(100%-384px)] ml-auto">
      <h1 className="text-3xl font-bold">Solicitudes de mensaje</h1>
      <ul className="flex flex-col gap-4 my-5">
        {incomings.map((requeser) => (
          <li
            className="flex items-center justify-between border gap-3 border-neutral-300 rounded-lg p-4 shadow"
            key={requeser.id}
          >
            <div className=" flex items-center">
              {requeser.image ? (
                <Image
                  src={requeser.image}
                  width={30}
                  height={30}
                  className="rounded-full"
                  alt={`${requeser.email} imagen perfil `}
                />
              ) : (
                <Image
                  src="/logo.png"
                  width={30}
                  height={30}
                  className="rounded-full"
                  alt={`${requeser.email} imagen perfil `}
                />
              )}
              <span>{requeser.email}</span>
            </div>
            <AcceptButton idToAccept={requeser.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
