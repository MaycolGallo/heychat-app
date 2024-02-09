import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ChatOptions } from "../header-menu-options";
import { DropdownOptions } from "../dropdown-options";
import Link from "next/link";

export async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="flex outline bg-neutral-50 dark:bg-neutral-800 outline-2 outline-neutral-200 dark:outline-neutral-800">
      <span className="border-r p-4 border-neutral-300 dark:border-neutral-700">
        <Link href="/chats">
          <Image
            src="/logo.png"
            width={40}
            height={40}
            className="rounded-full"
            alt="logo"
          />
        </Link>
      </span>
      <div className="flex flex-1 px-4 items-center justify-end gap-4">
        <ChatOptions />
        <DropdownOptions
          imgUrl={session?.user?.image!}
          userId={session?.user?.id!}
          name={session?.user?.name!}
          email={session?.user?.email!}
        />
      </div>
    </header>
  );
}
