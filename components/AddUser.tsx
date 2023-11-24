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
import { UserPlus2, Mail, Loader } from "lucide-react";
import { addUser } from "@/app/actions/addUser";
import { useActionState } from "@/lib/use-form-state";
import { useState } from "react";

export function AddUser() {
  const [adUser, { loading, data }] = useActionState(addUser);
  const [inputValue, setInputValue] = useState("");
  return (
    <div>
      <Dialog>
        <DialogTrigger className="bg-gradient-to-tr px-4 py-2 rounded-lg text-white from-blue-600 to-orange-600">
          Nuevo mensaje
        </DialogTrigger>

        <DialogContent className="p-0 gap-0 w-[calc(100%-1rem)] rounded-lg">
          <DialogHeader className="bg-neutral-100 border-b border-neutral-300 rounded-t-lg px-3 py-4">
            <DialogTitle>Enviar solicitud de mensaje</DialogTitle>
          </DialogHeader>
          <section className=" p-4">
            <form action={adUser}>
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="email"
                  className="text-base flex items-center gap-2"
                >
                  <Mail className=" h-5 w-5" />
                  Correo
                </Label>
                <Input
                  type="email"
                  required
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  // onBlur={() => setInputValue("")}
                  name="email"
                />
                {inputValue.length && data?.type === "error" ? (
                  <p className="text-red-500">{data.message}</p>
                ) : null}
                {inputValue.length && data?.type === "success" ? (
                  <p className="text-green-500">{data.message}</p>
                ): null}
              </div>
              <Button
                disabled={loading}
                type="submit"
                className="w-full mt-3 bg-violet-500"
              >
                {loading ? (
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <UserPlus2 className="mr-2 h-5 w-5" />
                )}
                {loading ? "Enviando Invitación" : "Enviar Invitación"}
              </Button>
            </form>
          </section>
        </DialogContent>
      </Dialog>
    </div>
  );
}
