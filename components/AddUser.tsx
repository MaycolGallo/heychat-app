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
import { useEffect, useState } from "react";

export function AddUser({ children }: { children?: React.ReactNode }) {
  const [adUser, { loading, data }] = useActionState(addUser);
  const {
    register,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    if (data?.type === "error") {
      setError("root.serverError", {
        type: "error",
        message: data?.message,
      });
    }
  },[setError, data]);

  useEffect(() => {
    if (data?.type === "success") {
      clearErrors("root.serverError");
    }
  },[clearErrors, data]);
  
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          {children ?? (
            <Button className="bg-gradient-to-tr px-4 hover:scale-105 transition-all py-2 rounded-lg text-white from-blue-600 to-purple-600">
              Agregar Contacto
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="p-0 gap-0 w-[calc(100%-1rem)] rounded-lg">
          <DialogHeader className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-700 rounded-t-lg px-3 py-4">
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
                  {...register("email",{
                    onChange: (e) => {
                      clearErrors("root.serverError");
                    }
                  })}
                  // onBlur={() => setInputValue("")}
                  name="email"
                />
                {errors.root?.serverError.type === "error" && (
                  <p className="text-red-500 text-sm">
                    {errors.root?.serverError.message}
                  </p>
                )}
                {data?.type === "success" && (
                  <p className="text-green-500 text-sm">
                    {data?.message}
                  </p>
                )}
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
