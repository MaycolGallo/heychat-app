"use client";

import { Button } from "@/components/ui/button";
import { UserCheck2, UserX2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { Dispatch } from "react";

export function AcceptButton({
  idToProcess,
  setRequests,
}: {
  idToProcess: string;
  setRequests: Dispatch<React.SetStateAction<Requests[]>>;
}) {
  const router = useRouter();
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
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => moneyForFun(idToProcess)}
        className="px-3 py-1 bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700"
      >
        <UserCheck2 className="w-5 h-5" />
      </Button>
      <Button
        onClick={() => moneyForLove(idToProcess)}
        className="px-3 hover:bg-red-600 py-1 bg-red-500 dark:bg-red-600 dark:hover:bg-red-700"
      >
        <UserX2 className="w-5 h-5" />
      </Button>
    </div>
  );
}
