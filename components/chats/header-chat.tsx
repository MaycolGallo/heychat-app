import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { UserCoordsInfo } from "../show-user-coords";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { ChatLocation } from "../chat-location";
import { BackButton } from "../ui/back-button";
import { UserStatus } from "../user-status";

type FriendInfo = {
  id: string;
  name: string;
  email: string;
  image?: string;
  isFriendCoors?: boolean;
};

export async function HeaderChat(props: FriendInfo) {
  return (
    <section className="flex w-full p-3 border-b dark:bg-neutral-900 dark:border-neutral-700 border-neutral-300 items-center">
      <div className="flex justify-between w-full items-center gap-3">
        <div className="flex items-center gap-3">
          <BackButton />
          <Image
            src={props?.image!}
            className="rounded-full"
            width={40}
            height={40}
            alt={`${props?.name} profile pic`}
          />
          <div className="text-sm flex justify-between sm:text-base">
            <div>
              <h2 className="font-semibold">{props?.name}</h2>
              <p>{props?.email}</p>
              <Suspense fallback={"Conectando..."}>
                <UserStatus userId={props.id} />
              </Suspense>
            </div>
            {/* <Suspense fallback={<Skeleton className="h-4 w-24" />}>
            <ChatLocation userId={props.id}/>
            </Suspense> */}
          </div>
        </div>
        <ChatLocation userId={props.id} />
      </div>
    </section>
  );
}
