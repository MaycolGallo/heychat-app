"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import { Input } from "../input";

import { Search } from "lucide-react";
import Link from "next/link";
import { linkChatSorted } from "@/lib/utils";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

export function SearchUsers({ userId }: { userId?: string }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const deferredSearch = useDeferredValue(search);
  const { data } = useSession();
  const containerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchSearchData = async () => {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: deferredSearch }),
      });
      const data = await res.json();
      setResults(data);
    };

    const debouncedFetchSearchData = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchSearchData, 500); // Adjust the debounce delay as needed
    };

    if (deferredSearch.length > 3) {
      debouncedFetchSearchData();
    }
  }, [deferredSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <label className="relative">
        <Search className="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600" />
        <input
          ref={containerRef}
          type="search"
          placeholder="Buscar"
          onChange={(e) => setSearch(e.target.value)}
          className="focus-visible:outline-none px-3 w-full border border-neutral-400/50 dark:border-neutral-600 placeholder-neutral-800 dark:placeholder-neutral-500 border-nuetral-300 rounded-lg py-2 ring-offset-2 dark:ring-offset-neutral-900 dark:bg-neutral-800 focus:ring-2 ring-blue-700 pl-9 bg-neutral-300"
          onFocus={() => setOpen((prev) => !prev)}
          // onBlur={() => setOpen(false)}
        />
      </label>
      {open ? (
        <div className="w-full absolute border min-h-[100px] p-4 translate-y-3 backdrop-blur-md rounded-lg border-neutral-300 dark:border-neutral-700 animate-in fade-in max-h-64 dark:bg-neutral-900/5  overflow-y-auto">
          {deferredSearch.length ? (
            <h1 className="my-1">Results for {deferredSearch}</h1>
          ) : null}

          <ul className="flex flex-col gap-4">
            {results.length === 0 ? (
              <div className="flex items-center justify-center">
                <h1 className="text-xl font-semibold">Sin Resultados</h1>
              </div>
            ) : deferredSearch.length === 0 ? (
              <>
                <div className="flex items-center justify-center">
                  <h1 className="text-xl font-semibold">Ingresa un usuario</h1>
                </div>
              </>
            ) : (
              <>
                {results.map((result: any) => (
                  <li className="flex items-center" key={result.item.id}>
                    <Link
                      href={`/chats/${linkChatSorted(
                        data?.user.id!,
                        result.item.id
                      )}`}
                      className="flex gap-3 w-full"
                    >
                      <span className="flex items-start">
                        <Image
                          src={result.item.image}
                          width={40}
                          height={40}
                          className="rounded-full shrink-0"
                          alt={`${result.item.name} profile pic`}
                        />
                      </span>
                      <div className="flex flex-1 flex-col justify-center">
                        <h1 className="font-semibold">{result.item.name}</h1>
                        <span>{result.item.email}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
