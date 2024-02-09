import { UserListChat } from "@/components/chats/list-chat";
import Image from "next/image";

export default function Home() {
  return (
    <section className="hidden md:flex flex-col flex-1 bg-sky-50 dark:bg-zinc-900 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Image src="/logo.png" className="animate-in zoom-in-75 duration-1000 transition-all" alt="logo" width={200} height={200} />
        <h1 className="animate-in fade-in-0 duration-1000 transition-all text-4xl font-bold">
          HeyChat!
        </h1>
      </div>
      <p className="max-w-md animate-in fade-in-0 transition-all duration-1000 text-black dark:text-neutral-50 my-5 text-center">
        Selecciona un contacto para crear una conversación o añade uno nuevo a
        tu lista.
      </p>
    </section>
  );
}
