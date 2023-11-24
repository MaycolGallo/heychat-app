"use client";

import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Suspense, useEffect, useState } from "react";
import { GeoInfo, UserCoordsInfo } from "./show-user-coords";
import { Switch } from "./ui/switch";
import { signOut } from "next-auth/react";
import { LogOutIcon } from 'lucide-react'

type Props = {
  imgUrl: string;
  userId: string;
};

export function DropdownOptions(props: Props) {
  const { imgUrl,userId } = props;
  const [locationActive, setLocationActive] = useState(() => {
    if (typeof window !== "undefined") {
      const storedLocation = window.localStorage.getItem("locationActive");
      return storedLocation ? JSON.parse(storedLocation) : false;
    }
    return false;
  });
  const [coord, setCoord] = useState<GeoInfo>({
    countryName: "",
    countryCode: "",
    city: "",
  });

  useEffect(() => {
    if (localStorage) localStorage.setItem("locationActive", JSON.stringify(locationActive)); 

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
          await fetch("/api/update-location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              locationActive,
              userId,
              cityName: data.city,
              countryName: data.countryName,
              countryCode: data.countryCode,
            }),
          });
          console.log(data);
        },
        (error) => {
          console.log(error);
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
      })
      setCoord({
        countryName: "",
        countryCode: "",
        city: "",
      });
    }
  }, [locationActive,userId]);

  return (
    <Popover >
      <PopoverTrigger>
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
      <PopoverContent side="bottom" align="end" alignOffset={0} sideOffset={5} className="backdrop-blur bg-white/75 backdrop-saturate-[180%]">
        <div>
          <h1 className="font-bold">Maytek</h1>
          <p>@maytek</p>
          <Suspense>
            <UserCoordsInfo coord={coord} />
          </Suspense>
        </div>
        <ul className="flex flex-col gap-3">
          <li className="flex justify-between items-center">
            Mostrar Ubicación{" "}
            <Switch
              onCheckedChange={setLocationActive}
              checked={locationActive}
            />
          </li>
          <li className="flex justify-between items-center">
            <button
              onClick={() => signOut()}
              className="text-red-500 font-bold flex gap-3"
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
