import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { UserCoordsInfo } from "../show-user-coords";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { ChatLocation } from "../chat-location";
import { BackButton } from "../ui/back-button";


type FriendInfo = {
  id: string;
  name: string;
  email: string;
  image?: string;
  isFriendCoors?: boolean;
};

export async function HeaderChat(props: FriendInfo) {
  return (
    <section className="flex w-full justify-between px-5 py-3 border-b border-neutral-300 items-center">
      <div className="flex items-center gap-3">
        <BackButton />
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
          <Suspense fallback={<Skeleton className="h-4 w-24" />}>
            <ChatLocation userId={props.id}/>
          </Suspense>

        </div>
      </div>
    </section>
  );
}
