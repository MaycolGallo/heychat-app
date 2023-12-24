"use client";

import { handleFriendRequest } from "@/app/actions/handle-friends";
import { Button } from "@/components/ui/button";
import { useActionState } from "@/lib/use-form-state";
import { UserCheck2, UserX2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

type Props = {
  idToProcess: string;
  setRequests: (
    action: Requests[] | ((pendingState: Requests[]) => Requests[])
  ) => void;
};

export function AcceptButton({ idToProcess, setRequests }: Props) {
  const router = useRouter();
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

  async function moneyForFun(idToAdd: string) {
    const res = await fetch("/api/solicitudes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: idToAdd,
        key: "add",
      }),
    });
    if (res.ok) {
      setRequests((current) =>
        current.filter((request) => request.senderId !== idToAdd)
      );
      router.refresh();
    }
  }
  async function moneyForLove(idToRemove: string) {
    const res = await fetch("/api/solicitudes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: idToRemove,
        key: "remove",
      }),
    });
    if (res.ok) {
      setRequests((current) =>
        current.filter((request) => request.senderId !== idToRemove)
      );
      router.refresh();
    }
  }

  console.log('its me the data',data);
  console.log('lil fella',error);
  return (
    <div className="flex items-center gap-2">
      <Button
        disabled={loading}
        onClick={() => processFriend(idToProcess, "add")}
        className="px-3 py-1 bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700"
      >
        <UserCheck2 className="w-5 h-5" />
      </Button>
      <Button
        disabled={loading}
        onClick={() => processFriend(idToProcess, "remove")}
        className="px-3 hover:bg-red-600 py-1 bg-red-500 dark:bg-red-600 dark:hover:bg-red-700"
      >
        <UserX2 className="w-5 h-5" />
      </Button>
    </div>
  );
}
