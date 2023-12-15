"use client";
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
import { cn } from "@/lib/utils";
import { Ban, ShieldCheck } from "lucide-react";
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

  const blockUser = useCallback(async () => {
    const res = await fetch(`/api/block-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactId,
        userId: sessionId,
      }),
    });
    if (res.status === 200) {
      setOpen(false);
    }
  }, [contactId, sessionId]);

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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* <AlertDialogAction onClick={blockUser}>Continue</AlertDialogAction> */}
          <Button onClick={blockUser}>Continuar</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
