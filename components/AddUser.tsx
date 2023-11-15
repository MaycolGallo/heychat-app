"use client";

import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UserPlus2 } from "lucide-react";
import { addUser } from "@/app/actions/addUser";
import { useActionState } from "use-action-state";
import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export function AddUser() {
  const [adUser, { loading, data, error }] = useActionState(addUser);
  
  return (
    <div>
      <h1>AddUser</h1>
      <Dialog>
        <DialogTrigger className="bg-gradient-to-tr px-4 py-2 rounded-lg text-white from-blue-600 to-orange-600">
          Nuevo mensaje
        </DialogTrigger>

        <DialogContent className="p-0 gap-0">
          <DialogHeader className="bg-neutral-100 border-b border-neutral-300 rounded-t-lg px-3 py-4">
            <DialogTitle>Enviar solicitud de mensaje</DialogTitle>
          </DialogHeader>
          <section className=" p-4">
            <form action={adUser}>
              <div className="flex flex-col gap-3">
                <Label htmlFor="email" className="text-base ">
                  Correo
                </Label>
                <Input type="email" required name="email" />
                {error ? (
                  <p className="text-red-500">{JSON.stringify(error)}</p>
                ) : (
                  <p className="text-green-500">{data?.message}</p>
                )}
              </div>
              <Button
                disabled={loading}
                type="submit"
                className="w-full mt-3 bg-violet-500"
              >
                <UserPlus2 className="mr-2 h-5 w-5" />
                {loading ? "Enviando Invitación" : "Enviar Invitación"}
              </Button>
            </form>
          </section>
        </DialogContent>
      </Dialog>
    </div>
  );
}
