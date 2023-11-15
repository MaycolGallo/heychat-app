"use client";

import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export function AcceptButton({ idToAccept }: { idToAccept: string }) {
  async function moneyForFun(idToAdd: string) {
     await fetch("/api/solicitudes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: idToAdd,
      }),
    });
    revalidatePath("/chats/solicitudes");
  }
  return (
    <Button onClick={() => moneyForFun(idToAccept)} className="px-3 py-1 bg-violet-500">
      Aceptar
    </Button>
  );
}
