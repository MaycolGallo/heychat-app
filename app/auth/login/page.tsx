/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function Login() {

  async function login() {
    try {
      await signIn("google");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <main className="flex items-center bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 justify-center min-h-screen">
      <section className="max-w-md mx-3 sm:mx-auto w-full bg-white/50 p-6 rounded-2xl backdrop-saturate-[180%]">
        <div className="flex flex-col items-center">
          <Image src={"/logo.png"} width={80} height={80} alt="logo" />
          <h1 className="text-3xl font-bold text-center">Iniciar Sesión</h1>
          <Button
            onClick={login}
            className="w-full my-3 py-6 text-lg rounded-lg bg-slate-900 hover:bg-slate-950 font-semibold"
          >
            <img
              className="h-5 mr-2"
              src="https://cdn.svgporn.com/logos/google-icon.svg"
              alt=""
            />
            Google
          </Button>
        </div>
        <form className="flex flex-col gap-3 my-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              className="rounded-lg"
              name="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input className="rounded-lg" type="password" name="password" />
          </div>
          <Button className="w-full rounded-lg bg-blue-700 hover:bg-blue-600 my-3 text-lg">
            Entrar
          </Button>
        </form>
      </section>
    </main>
  );
}
