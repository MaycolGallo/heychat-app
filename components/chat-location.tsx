"use client";

import { useEffect, useState } from "react";
import { GeoInfo, UserCoordsInfo } from "./show-user-coords";
import { pusherClient } from "@/lib/pusher";
import usePartySocket from "partysocket/react";
import { MapPin, MapPinned } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import ReactCountryFlag from "react-country-flag";

type GeoResult = {
  locationActive?: boolean;
  userId?: string;
} & GeoInfo;

export function ChatLocation({ userId }: { userId: string }) {
  const [coord, setCoord] = useState<GeoResult>({
    countryName: "",
    countryCode: "",
    city: "",
    locality: "",
  });

  usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: "user-location",
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      // console.log("yo what going on ", message);s
      if (userId !== message.userId) {
        setCoord(message);
      }
    },
  });

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
      {coord.locationActive ? (
        <Popover>
          <PopoverTrigger className="border dark:border-neutral-700 p-2 rounded">
            <MapPinned className="w-4 h-4" />
          </PopoverTrigger>
          <PopoverContent align="end">
            <span className="flex items-center gap-3">
              <MapPin className="w-4 h-4" />
              Desde {coord.locality} - {coord.city}, {coord.countryName}
              <ReactCountryFlag
                svg
                className="w-5 h-5"
                aria-label="country flag"
                title="country flag"
                countryCode={coord.countryCode}
              />
            </span>
          </PopoverContent>
        </Popover>
      ) : null}
    </>
  );
}
