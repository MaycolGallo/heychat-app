import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ChatOptions } from "../chat-options";
// import logo from '@/real-logo (1).svg'

export async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="flex outline outline-2 outline-neutral-200 px-4 justify-between items-center">
      <span className="border-r border-neutral-300">
        <Image
          src="/logo.png"
          width={90}
          height={90}
          fetchPriority="high"
          alt="logo"
        />
      </span>
      <div className="flex items-center gap-4">
        <ChatOptions />
        <span>
          <Image
            src={session?.user?.image!}
            width={30}
            height={30}
            className="rounded-full"
            alt="profile-pic"
          />
        </span>
        <div className="flex flex-col">
          <h2 className="font-semibold">{session?.user?.name}</h2>
          <p>{session?.user?.email}</p>
        </div>
      </div>
    </header>
  );
}
