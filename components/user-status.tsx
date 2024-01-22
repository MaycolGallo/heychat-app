"use client";

import { lastSeen } from "@/lib/lastSeen";
import { useParams } from "next/navigation";
import usePartySocket from "partysocket/react";
import { useState } from "react";

type Test = {
  type: string;
  status: {
    userId?: string;
    id: string;
    isConnected: boolean;
    connectedAt: number;
    disconnectedAt: number | null;
  };
};

export function UserStatus({ userId }: { userId: string }) {
  const chatId = useParams().chatId;
  const [statusUser, setStatusUser] = useState<Test>();

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: chatId.toString(),
    party: "conexions",
    onOpen: () => {
      const status = {
        userId,
        id: socket.id,
        isConnected: true,
        disconnectedAt: null,
        connectedAt: Date.now(),
      };
      socket.send(JSON.stringify({ type: "join", status }));
    },
    onMessage(event) {
      const status = JSON.parse(event.data) as any;
      let newUser;
      if (status.connecteds) {
         newUser = status.connecteds.find(
          ({ status }: { status: Test["status"] }) => status.userId !== userId
        );
      }
      console.log('hello  mylil bros', status)
      console.log("newUser", newUser);
      console.log("interesting", status?.connecteds);

      if (status.type !== "leave" && status.connecteds) {
        setStatusUser(newUser);
      }
      
      // switch (status.type) {
      //   case "join":
      //     console.log("join", status);
      //     setKaukas(status);
      //     break
      //   case "leave":
      //     console.log("leave", status);
      //     break
      // }
    },
  });

  const checkStatus = statusUser?.type === "join" && statusUser?.status.userId
  //   if (!statusUser) {
  //     console.log("statusUser", statusUser);
  //     return <span>Conectando...</span>;
  //   }
  return (
    <div>
     {/* <span>Yo lil bros: {JSON.stringify(statusUser)}</span> */}
      {statusUser?.type === "join" && statusUser?.status.isConnected ? (
        <span className="h-3 w-3 absolute border border-neutral-200 rounded-full -translate-x-6 -translate-y-1 bg-lime-500"></span>
      ) : (
        <span className="h-3 w-3 absolute border border-neutral-200 rounded-full -translate-x-6 -translate-y-1 bg-neutral-500"></span>
      )}
      {checkStatus && statusUser.status.isConnected ? (
        <span className="text-lime-600 text-sm">En Línea</span>
      ): (
        <span className="text-neutral-500 dark:text-neutral-300">
          {statusUser?.status.disconnectedAt && statusUser.type === "join" ? (
            <span className="text-sm">
              Ultima vez {lastSeen(statusUser?.status?.disconnectedAt!)}
            </span>
          ) : (
            <span className="text-sm">Ultima vez desconocida</span>
          )}
        </span>
      )}
    </div>
  );
}
