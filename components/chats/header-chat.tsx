import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Image from "next/image";

type FriendInfo = {
  name: string;
  email: string;
  image?: string;
};

export async function HeaderChat(props: FriendInfo) {
  return (
    <section className="flex w-full justify-between px-5 py-3 border-b border-neutral-300 items-center">
      <div className="flex items-center gap-3">
        <Image
          src={props?.image!}
          className="rounded-full"
          width={40}
          height={40}
          alt={`${props?.name} profile pic`}
        />
        <div>
          <h2 className="font-semibold">{props?.name}</h2>
          <p>{props?.email}</p>
        </div>
      </div>
    </section>
  );
}
