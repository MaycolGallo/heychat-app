"use client";
import { blockUser } from "@/app/actions/block-user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActionState } from "@/lib/use-form-state";
import { cn } from "@/lib/utils";
import { Ban, Loader, ShieldCheck } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useCallback, useState } from "react";

type Props = {
  name: string;
  contactId: string;
  sessionId?: string;
  type?: "block" | "unblock";
};

export function BlockUser(props: Props) {
  const { name, contactId, sessionId, type } = props;
  const [open, setOpen] = useState(false);
  const [handleBlock, { loading, error, data }] = useActionState(blockUser);

  const BlockUser = useCallback(async (contactId: string, sessionId:string) => {
    if (data?.success) {
      setOpen(false);
    }
    await handleBlock( contactId, sessionId );
    console.log(contactId, sessionId)
  },[data?.success, handleBlock]);

  // const blockUser = useCallback(async () => {
  //   const res = await fetch(`/api/block-user`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       contactId,
  //       userId: sessionId,
  //     }),
  //   });
  //   if (res.status === 200) {
  //     setOpen(false);
  //   }
  // }, [contactId, sessionId]);
  console.log(data)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className={cn(
          "p-2 rounded-md",
          type === "block"
            ? "bg-red-300 hover:bg-red-400 text-red-900"
            : "bg-green-300 hover:bg-green-400 text-green-900"
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {type === "block" ? (
                <Ban className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {type === "block" ? (
                <span>Bloquear</span>
              ) : (
                <span>Desbloquear</span>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {type === "block" ? `¿Bloquear ${name}?` : `¿Desbloquear ${name}?`}
          </AlertDialogTitle>
          <AlertDialogDescription style={{ whiteSpace: "pre-wrap" }}>
            {type === "block"
              ? "¿Estás seguro de que quieres bloquear a este usuario? El bloqueo le impedirá interactuar contigo y ver tus contenidos."
              : "¿Estás seguro de que quieres desbloquear a este usuario? El desbloqueo le permitira interactuar contigo y ver tus contenidos."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            disabled={loading}
            // onClick={() => handleBlock(contactId, sessionId!)}
            onClick={() => BlockUser(contactId, sessionId!)}
          >
            {loading && <Loader className="w-4 animate-spin h-4 mr-2" />}
            <span>{type === "block" ? "Bloquear" : "Desbloquear"}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
