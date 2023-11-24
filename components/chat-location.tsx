"use client";

import { useEffect, useState } from "react";
import { GeoInfo, UserCoordsInfo } from "./show-user-coords";
import { pusherClient } from "@/lib/pusher";

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

  useEffect(() => {
    //channel name no event
    pusherClient.subscribe("update-location");

    //event name
    pusherClient.bind("location-updated", (data: GeoResult) => {
      if (userId !== data.userId) {
        setCoord(data)
        console.log(data)
      }
    });

    return () => {
      pusherClient.unsubscribe("update-location");
      pusherClient.unbind("location-updated");
    };
  }, [userId]);

  return (
    <>
      { coord.locationActive ? (
        <UserCoordsInfo coord={coord} />
      ) : null}
    </>
  );
}
