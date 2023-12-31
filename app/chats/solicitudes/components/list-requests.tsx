"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { startTransition, useEffect, useState } from "react";
import { AcceptButton } from "./accept-btn";
import Image from "next/image";
import { UserCheck2, UserX, UserX2 } from "lucide-react";
import { handleFriendRequest } from "@/app/actions/handle-friends";
import { useActionState } from "@/lib/use-form-state";
import { Button } from "@/components/ui/button";

type Props = {
  initialRequests: Requests[];
  sessionId: string;
};

function EmptyList() {
  return (
    <div className="flex w-72 py-6 bg-white dark:bg-neutral-800 dark:border-neutral-700 dark:text-white mx-auto border shadow rounded-lg translate-y-[150%] flex-col items-center justify-center gap-2">
      <UserX className="h-12 w-12 text-neutral-400" />
      <p>Sin solicitudes de mensaje</p>
    </div>
  );
}

export function ListRequests({ initialRequests, sessionId }: Props) {
  const [requests, setRequests] = useState(initialRequests);
  const [handleFriend, { loading, error, data }] =
    useActionState(handleFriendRequest);

  async function processFriend(idToProcess: string, key: string) {
    if (key === "add" || key === "remove") {
      startTransition(() => {
        setRequests((current) =>
          current.filter((request) => request.senderId !== idToProcess)
        );
      });
    }
    await handleFriend(idToProcess, key);
  }

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const newFriendRequestHandler = (newFriendRequest: Requests) => {
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
    <div className="request-container">
      {requests.length ? (
        <ul className="grid requests grid-cols-1 gap-4 my-5">
          {requests.map((requeser) => (
            <li
              className="flex items-center bg-white dark:bg-neutral-800 dark:border-neutral-700 dark:text-white justify-between border gap-3 border-neutral-300 rounded-lg p-4 shadow"
              key={requeser.senderId}
            >
              <div className=" flex items-center gap-3">
                {requeser.senderImage ? (
                  <Image
                    src={requeser.senderImage}
                    width={30}
                    height={30}
                    className="rounded-full"
                    alt={`${requeser.senderEmail} imagen perfil `}
                  />
                ) : (
                  <Image
                    src="/logo.png"
                    width={30}
                    height={30}
                    className="rounded-full"
                    alt={`${requeser.senderEmail} imagen perfil `}
                  />
                )}
                <span className="truncate">{requeser.senderEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  disabled={loading}
                  onClick={() => processFriend(requeser.senderId, "add")}
                  className="px-3 py-1 dark:text-white bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700"
                >
                  <UserCheck2 className="w-5 h-5" />
                </Button>
                <Button
                  disabled={loading}
                  onClick={() => processFriend(requeser.senderId, "remove")}
                  className="px-3 hover:bg-red-600 dark:text-white py-1 bg-red-500 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  <UserX2 className="w-5 h-5" />
                </Button>{" "}
              </div>
              {/* <AcceptButton setRequests={setOptimistic} idToProcess={requeser.senderId} /> */}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyList />
      )}
    </div>
  );
}
