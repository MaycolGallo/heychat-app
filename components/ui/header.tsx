import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ChatOptions } from "../header-menu-options";
import { DropdownOptions } from "../dropdown-options";
import Link from "next/link";
// import logo from '@/real-logo (1).svg'

export async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="flex outline bg-neutral-50 outline-2 outline-neutral-200">
      <span className="border-r p-4 border-neutral-300">
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
        />
        {/* <span>
          <Image
            src={session?.user?.image!}
            width={40}
            height={40}
            className="rounded-full"
            alt="profile-pic"
          />
        </span> */}
      </div>
    </header>
  );
}
