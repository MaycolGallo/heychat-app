"use client";

import { useEffect, useState } from "react";
import { GeoInfo, UserCoordsInfo } from "./show-user-coords";
import { pusherClient } from "@/lib/pusher";
import usePartySocket from "partysocket/react";

type GeoResult = {
  locationActive?: boolean;
  userId?: string;
} & GeoInfo;

export function ChatLocation({userId}:{userId:string}) {
  const [coord, setCoord] = useState<GeoResult>({
    countryName: "",
    countryCode: "",
    city: "",
  });

  usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: "user-location",
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      console.log("yo what going on ", message);
      if (userId !== message.userId) {
        setCoord(message);
      }
    }
  })

  // useEffect(() => {
  //   //channel name no event
  //   pusherClient.subscribe("update-location");

  //   //event name
  //   pusherClient.bind("location-updated", (data: GeoResult) => {
  //     if (userId !== data.userId) {
  //       setCoord(data)
  //       console.log(data)
  //     }
  //   });

  //   return () => {
  //     pusherClient.unsubscribe("update-location");
  //     pusherClient.unbind("location-updated");
  //   };
  // }, [userId]);

  return (
    <>
      { coord.locationActive ? (
        <span>{JSON.stringify(coord)}</span>
      ) : null}
    </>
  );
}
