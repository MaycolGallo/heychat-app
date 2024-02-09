"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import {
  startTransition,
  useCallback,
  useEffect,
  useOptimistic,
  useState,
} from "react";
import { AcceptButton } from "./accept-btn";
import Image from "next/image";
import { UserCheck2, UserX, UserX2 } from "lucide-react";
import { handleFriendRequest } from "@/app/actions/handle-friends";
import { useActionState } from "@/lib/use-form-state";
import { Button } from "@/components/ui/button";
import { ToastError, ToastSuccess } from "@/components/toasts/toasts";
import { toast } from "sonner";
import { MagicExit, MagicMotion } from "react-magic-motion";

type Props = {
  initialRequests: Requests[];
  sessionId: string;
};

function EmptyList() {
  return (
    <div className="flex animate-in fade-in-0 duration-1000 w-72 py-6 bg-white dark:bg-neutral-800 dark:border-neutral-700 dark:text-white mx-auto border shadow rounded-lg translate-y-[150%] flex-col items-center justify-center gap-2">
      <UserX key="exclude" className="h-12 w-12 text-neutral-400" />
      <p>Sin solicitudes de mensaje</p>
    </div>
  );
}

export function ListRequests({ initialRequests, sessionId }: Props) {
  const [requests, setRequests] = useState(initialRequests);
  const [fastReq, setFastReq] = useOptimistic(requests);
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
    const res = await handleFriend(idToProcess, key);
    if (res.data?.type === "error") {
      ToastError({ message: res.data.message });
    } else {
      ToastSuccess({ message: res.data?.message! });
    }
  }

  function optimisticFriend(idToProcess: string, key: string) {
    if (key === "add" || key === "remove") {
      startTransition(() => {
        setFastReq((current) =>
          current.filter((request) => request.senderId !== idToProcess)
        );
      });
    }
  }

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const newFriendRequestHandler = (newFriendRequest: Requests) => {
      setRequests((current) => [...current, newFriendRequest]);
      startTransition(() => {
        setFastReq((current) => [...current, newFriendRequest]);
      });
    };

    pusherClient.bind("new_incoming_friend", newFriendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("new_incoming_friend", newFriendRequestHandler);
    };
  }, [sessionId, setFastReq]);

  return (
    <div className="request-container">
      <MagicMotion>
        <ul className="grid requests grid-cols-1 gap-4 my-5">
          <MagicExit
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { type: "spring", stiffness: 120 },
            }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            mode="popLayout"
          >
            {fastReq.map((requeser) => (
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
                    onClick={() => {
                      optimisticFriend(requeser.senderId, "add");
                      processFriend(requeser.senderId, "add");
                    }}
                    className="px-3 py-1 dark:text-white bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700"
                  >
                    <UserCheck2 className="w-5 h-5" />
                  </Button>
                  <Button
                    disabled={loading}
                    onClick={() => {
                      optimisticFriend(requeser.senderId, "remove");
                      processFriend(requeser.senderId, "remove");
                    }}
                    className="px-3 hover:bg-red-600 dark:text-white py-1 bg-red-500 dark:bg-red-600 dark:hover:bg-red-700"
                  >
                    <UserX2 className="w-5 h-5" />
                  </Button>{" "}
                </div>
                {/* <AcceptButton setRequests={setOptimistic} idToProcess={requeser.senderId} /> */}
              </li>
            ))}
          </MagicExit>
        </ul>
      </MagicMotion>
      
      {!fastReq.length && <EmptyList />}
    </div>
  );
}
