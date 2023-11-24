"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AcceptButton } from "./accept-btn";
import Image from "next/image";
import { UserX } from "lucide-react";

type Props = {
  initialRequests: User[];
  sessionId: string;
};

function EmptyList() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <UserX className="h-12 w-12 text-neutral-400" />
      <p>Sin solicitudes de mensaje</p>
    </div>
  );
}

export default function ListRequests({ initialRequests, sessionId }: Props) {
  const [requests, setRequests] = useState(initialRequests);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const newFriendRequestHandler = (newFriendRequest: User) => {
      setRequests((current) => [...current, newFriendRequest]);
    };

    pusherClient.bind("new_incoming_friend", newFriendRequestHandler);
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("new_incoming_friend", newFriendRequestHandler);
    };
  }, [sessionId]);

  return (
    <ul className="grid grid-cols-2 gap-4 my-5">
      {requests.length ? (
        <>
          {requests.map((requeser) => (
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
        </>
      ) : (
        <EmptyList />
      )}
    </ul>
  );
}
