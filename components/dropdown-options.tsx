"use client";

import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Suspense, useEffect, useState } from "react";
import { GeoInfo, UserCoordsInfo } from "./show-user-coords";
import { Switch } from "./ui/switch";
import { signOut } from "next-auth/react";
import { LogOutIcon, SunIcon, MoonIcon, Info, Mail } from "lucide-react";
import { db } from "@/lib/db";
import { useTheme } from "next-themes";
import usePartySocket from "partysocket/react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { IconFacebook, IconInstagram, IconTiktok } from "./brand-icons";

type Props = {
  imgUrl: string;
  userId: string;
  email: string;
  name: string;
};

export function DropdownOptions(props: Props) {
  const { imgUrl, userId, email, name } = props;
  const { theme, setTheme } = useTheme();

  const [loterror, setError] = useState<GeolocationPositionError | null>(null);
  const [locationActive, setLocationActive] = useState(() => {
    if (typeof window !== "undefined") {
      const storedLocation = window.localStorage.getItem("locationActive");
      return storedLocation ? JSON.parse(storedLocation) : false;
    }
  });

  const [coord, setCoord] = useState<GeoInfo>({
    countryName: "",
    countryCode: "",
    locality: "",
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
              city: data.city,
              locality: data.locality,
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
          setError(error);
          setLocationActive(false);
          console.log(error);
          setCoord({
            countryName: "",
            countryCode: "",
            city: "",
            locality: "",
          });
        }
      );
    } else {
      socket.send(JSON.stringify({ type: "location", userId, locationActive }));
      setCoord({
        countryName: "",
        countryCode: "",
        locality: "",
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
            <UserCoordsInfo coord={coord} error={loterror} />
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
          <li className="flex justify-between hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded px-2 py-2 items-center">
            <Credits />
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function Credits() {
  const socials = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/rosanauticasrl/",
      icon: <IconInstagram />,
      classname:'hover:bg-amber-500'
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/larosanauticasrl.com.pe/",
      icon: <IconFacebook />,
      classname:'hover:bg-blue-500'
    },
    {
      name: "Tiktok",
      url: "https://www.tiktok.com/@inversioneslarosanautic1?is_from_webapp=1&sender_device=pc",
      icon: <IconTiktok />,
      classname:'hover:bg-pink-500'

    },
  ];

  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-3 w-full">
        <Info />
        Ver Créditos
      </DialogTrigger>
      <DialogContent>
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="https://larosanautica.com.pe/wp-content/uploads/2023/08/271601663_469086784815230_223349582365008669_n-3.jpg"
              alt="logo"
              width={30}
              height={30}
              objectFit=""
              className="rounded-md"
            />
            <h1 className="font-semibold">
              INVERSIONES LA ROSA NAUTICA S.R.L.
            </h1>
          </div>
          <ul className="py-3">
            <li>
              <span className="font-semibold">RUC</span>: 20571320607
            </li>
            <li>
              <span className="font-semibold">Dirección</span>: Lima
            </li>
            <li>
              <span className="font-semibold">Teléfono</span>: 920874994
            </li>
            <li>
              <span className="font-semibold">Correos</span>:
              larosanauticasrl@hotmail.com - larosanauticasrl@gmail.com
            </li>
            <li className="flex gap-3 justify-center pt-3">
              {socials.map((social) => (
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  key={social.name}
                  className={` ${social.classname} border border-neutral-400 dark:border-neutral-700 rounded-full p-2`}
                >
                  {social.icon}
                </a>
              ))}
            </li>
           
            <li className="text-center mt-3">Copyright © {new Date().getFullYear()}</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
