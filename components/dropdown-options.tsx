"use client";

import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Suspense, useEffect, useState } from "react";
import { GeoInfo, UserCoordsInfo } from "./show-user-coords";
import { Switch } from "./ui/switch";
import { signOut } from "next-auth/react";
import { LogOutIcon, SunIcon, MoonIcon } from "lucide-react";
import { db } from "@/lib/db";
import { useTheme } from "next-themes";
import usePartySocket from "partysocket/react";

type Props = {
  imgUrl: string;
  userId: string;
  email: string;
  name: string;
};

export function DropdownOptions(props: Props) {
  const { imgUrl, userId, email, name } = props;
  const { theme, setTheme } = useTheme();

  const [locationActive, setLocationActive] = useState(() => {
    if (typeof window !== "undefined") {
      const storedLocation = window.localStorage.getItem("locationActive");
      return storedLocation ? JSON.parse(storedLocation) : false;
    }
  });

  const [coord, setCoord] = useState<GeoInfo>({
    countryName: "",
    countryCode: "",
    city: "",
  });

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: "user-location",
  });

  useEffect(() => {
    if (localStorage)
      localStorage.setItem("locationActive", JSON.stringify(locationActive));

    if (locationActive && navigator.geolocation) {
      console.log("Getting location...", locationActive);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const result = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es `
          );
          const data = await result.json();
          setCoord(data);

          // await db.json.geoadd("user-locations", { latitude, longitude, member: `${userId}:current_location` });
          socket.send(
            JSON.stringify({
              type: "location",
              userId,
              locationActive,
              cityName: data.city,
              countryName: data.countryName,
              countryCode: data.countryCode,
            })
          );

          // await fetch("/api/update-location", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({
          //     locationActive,
          //     userId,
          //     cityName: data.city,
          //     countryName: data.countryName,
          //     countryCode: data.countryCode,
          //   }),
          // });
          console.log(data);
        },
        (error) => {
          setCoord({
            countryName: "",
            countryCode: "",
            city: "",
          });
        }
      );
    } else {
      fetch("/api/update-location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationActive: locationActive,
        }),
      });
      setCoord({
        countryName: "",
        countryCode: "",
        city: "",
      });
    }
  }, [locationActive, userId, socket]);

  return (
    <Popover>
      <PopoverTrigger className="hover:ring-blue-700  hover:ring-2 rounded-full ring-offset-2 dark:ring-offset-black">
        <span>
          <Image
            src={imgUrl}
            width={40}
            height={40}
            className="rounded-full"
            alt="profile-pic"
          />
        </span>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        alignOffset={0}
        sideOffset={5}
        className="backdrop-blur bg-white/75 border border-neutral-300 dark:border-neutral-900 dark:bg-neutral-800 p-0 backdrop-saturate-[180%]"
      >
        <div className="p-3 border-b border-neutral-300 dark:border-b-neutral-600">
          <h1 className="font-bold">{name}</h1>
          <p className="text-truncate">{email}</p>
          <Suspense fallback={<div>Loading...</div>}>
            <UserCoordsInfo coord={coord} />
          </Suspense>
        </div>
        <ul className="flex m-2 flex-col">
          <li className="flex justify-between px-2 py-2 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700 items-center">
            Mostrar Ubicación{" "}
            <Switch
              onCheckedChange={setLocationActive}
              checked={locationActive}
            />
          </li>
          <li className="flex justify-between hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded px-2 py-2 items-center">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className=" flex gap-3 "
            >
              <span>{theme === "dark" ? <SunIcon /> : <MoonIcon />}</span>
              Tema {theme === "light" ? "Oscuro" : "Claro"}
            </button>
          </li>
          <li className="flex justify-between hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded px-2 py-2 items-center">
            <button
              onClick={() => signOut()}
              className="text-red-500 w-full font-bold flex gap-3"
            >
              <LogOutIcon />
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
